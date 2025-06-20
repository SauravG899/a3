"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/card"
import { SettingsPanel } from "@/components/settings-panel"
import { InstructionsPopup } from "@/components/instructions-popup"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Game types
export type GameMode = "pictures" | "facts"
export type Difficulty = "easy" | "medium" | "hard"

// Card data interfaces
export interface CardItem {
  id: number
  value: string
  matched: boolean
  flipped: boolean
  matchId?: number
}

interface MemoryGameProps {
  showInstructionsOnLoad?: boolean
}

export function MemoryGame({ showInstructionsOnLoad = false }: MemoryGameProps) {
  const [cards, setCards] = useState<CardItem[]>([])
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameMode, setGameMode] = useState<GameMode>("pictures")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [showSettings, setShowSettings] = useState(false)
  const [showInstructions, setShowInstructions] = useState(showInstructionsOnLoad)
  const [gameComplete, setGameComplete] = useState(false)
  const { toast } = useToast()

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [gameMode, difficulty])

  const initializeGame = () => {
    setFlippedCards([])
    setMoves(0)
    setMatchedPairs(0)
    setGameComplete(false)

    let cardCount = 0
    switch (difficulty) {
      case "easy":
        cardCount = 12
        break
      case "medium":
        cardCount = 16
        break
      case "hard":
        cardCount = 24
        break
    }

    const newCards = generateCards(cardCount, gameMode)
    setCards(newCards)
  }

  const generateCards = (count: number, mode: GameMode): CardItem[] => {
    let items: CardItem[] = []

    if (mode === "pictures") {
      // Emoji cards for picture mode
      const emojis = [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
        "🐦",
        "🦆",
        "🦉",
      ]
      const selectedEmojis = emojis.slice(0, count / 2)

      items = selectedEmojis.flatMap((emoji, index) => [
        { id: index * 2, value: emoji, matched: false, flipped: false },
        { id: index * 2 + 1, value: emoji, matched: false, flipped: false },
      ])
    } else {
      // Fact pairs for fact mode
      const factPairs = [
        { q: "France", a: "Paris" },
        { q: "Japan", a: "Tokyo" },
        { q: "Egypt", a: "Cairo" },
        { q: "Brazil", a: "Brasília" },
        { q: "Australia", a: "Canberra" },
        { q: "Canada", a: "Ottawa" },
        { q: "Germany", a: "Berlin" },
        { q: "India", a: "New Delhi" },
        { q: "Italy", a: "Rome" },
        { q: "Mexico", a: "Mexico City" },
        { q: "Russia", a: "Moscow" },
        { q: "Spain", a: "Madrid" },
      ]

      const selectedPairs = factPairs.slice(0, count / 2)

      items = selectedPairs.flatMap((pair, index) => [
        { id: index * 2, value: pair.q, matched: false, flipped: false, matchId: index },
        { id: index * 2 + 1, value: pair.a, matched: false, flipped: false, matchId: index },
      ])
    }

    // Shuffle cards
    return items.sort(() => Math.random() - 0.5)
  }

  const handleCardClick = (clickedCard: CardItem) => {
    // Prevent clicking if card is already flipped or matched
    if (clickedCard.flipped || clickedCard.matched || flippedCards.length >= 2) {
      return
    }

    // Flip the card
    const updatedCards = cards.map((card) => (card.id === clickedCard.id ? { ...card, flipped: true } : card))
    setCards(updatedCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(newFlippedCards)

    // Check for match if we have 2 flipped cards
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      let isMatch = false

      if (gameMode === "pictures") {
        isMatch = newFlippedCards[0].value === newFlippedCards[1].value
      } else {
        isMatch = newFlippedCards[0].matchId === newFlippedCards[1].matchId
      }

      if (isMatch) {
        // Mark cards as matched
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, matched: true } : card,
          )
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Check if game is complete
          if (matchedPairs + 1 === cards.length / 2) {
            setGameComplete(true)
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
            toast({
              title: "Game Complete!",
              description: `You completed the game in ${moves + 1} moves.`,
            })
          }
        }, 500)
      } else {
        // Flip cards back
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id ? { ...card, flipped: false } : card,
          )
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleSettingsChange = (mode: GameMode, diff: Difficulty) => {
    setGameMode(mode)
    setDifficulty(diff)
    setShowSettings(false)
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${gameMode === "pictures" ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800" : "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"}`}>
      {/* Header and Subtitle */}
      <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight text-center mt-16">MEMORY MATCH</h1>
      <p className="text-xl text-white/90 mb-8 text-center">Find all matching pairs with the fewest moves!</p>
      {/* Mode Selector */}
      <div className="bg-white rounded-full px-6 py-3 inline-flex items-center gap-2 text-lg font-semibold mb-4">
        <span className="text-gray-700">MODE:</span>
        <button
          onClick={() => setGameMode("pictures")}
          className={`px-3 py-1 rounded-full transition-colors font-bold ${gameMode === "pictures" ? "text-orange-500 bg-orange-100" : "text-gray-600 hover:text-orange-500"}`}
        >
          PICTURES
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={() => setGameMode("facts")}
          className={`px-3 py-1 rounded-full transition-colors font-bold ${gameMode === "facts" ? "text-blue-600 bg-blue-100" : "text-gray-600 hover:text-blue-600"}`}
        >
          Facts
        </button>
      </div>
      {/* Game Area Layout */}
      <div className="flex w-full justify-center items-start gap-8">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="bg-[#e9ecf1] text-[#222] border-none hover:bg-[#dbe3ea] px-8 py-3 text-base font-semibold flex items-center gap-2" onClick={() => setShowSettings(true)}>
            <Settings className="w-5 h-5" /> settings
          </Button>
          <Button variant="outline" className="bg-[#e9ecf1] text-[#222] border-none hover:bg-[#dbe3ea] px-8 py-3 text-base font-semibold flex items-center gap-2" onClick={initializeGame}>
            <RotateCcw className="w-5 h-5" /> reset
          </Button>
          <Button variant="outline" className="bg-[#e9ecf1] text-[#222] border-none hover:bg-[#dbe3ea] px-8 py-3 text-base font-semibold flex items-center gap-2" onClick={() => setShowInstructions(true)}>
            <HelpCircle className="w-5 h-5" /> instructions
          </Button>
        </div>
        {/* Card Grid */}
        <div className="grid grid-cols-4 gap-6 flex-1 max-w-2xl mb-16">
          {cards.map((card) => (
            <div key={card.id} className="aspect-square min-w-[100px] min-h-[100px] sm:min-w-[120px] sm:min-h-[120px] md:min-w-[140px] md:min-h-[140px] rounded-2xl text-5xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Card card={card} gameMode={gameMode} onClick={() => handleCardClick(card)} />
            </div>
          ))}
        </div>
        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#ffe44d] text-[#222] px-8 py-3 rounded-lg text-base font-bold shadow text-center">Moves: {moves}</div>
          <div className="bg-[#ffe44d] text-[#222] px-8 py-3 rounded-lg text-base font-bold shadow text-center">Matches: {matchedPairs}</div>
        </div>
      </div>
      {showSettings && (
        <SettingsPanel
          currentMode={gameMode}
          currentDifficulty={difficulty}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsChange}
        />
      )}
      {showInstructions && <InstructionsPopup open={showInstructions} onClose={() => setShowInstructions(false)} />}
      <Dialog open={gameComplete} onOpenChange={(open) => { if (!open) initializeGame(); }}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-2">Game Complete!</DialogTitle>
          </DialogHeader>
          <div className="text-lg mb-4">You completed the game in <span className="font-bold">{moves}</span> moves.</div>
          <DialogFooter>
            <Button onClick={initializeGame} className="mx-auto">Play Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
