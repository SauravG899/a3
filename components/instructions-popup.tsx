"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InstructionsPopupProps {
  open: boolean
  onClose: () => void
}

export function InstructionsPopup({ open, onClose }: InstructionsPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">How to Play</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pictures">Picture Mode</TabsTrigger>
            <TabsTrigger value="facts">Fact Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <h3 className="font-medium text-lg">Game Objective</h3>
            <p>
              Memory Match is a card-matching game where you need to find all matching pairs of cards with the fewest
              moves possible.
            </p>

            <h3 className="font-medium text-lg">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click on any card to flip it and reveal what's underneath</li>
              <li>Click on a second card to try to find a match</li>
              <li>If the cards match, they stay face up</li>
              <li>If they don't match, they flip back over</li>
              <li>Continue until you've matched all pairs</li>
            </ol>

            <h3 className="font-medium text-lg">Game Settings</h3>
            <p>Click the Settings button to change:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Game mode (Pictures or Facts)</li>
              <li>Difficulty level (Easy: 12 cards, Medium: 16 cards, Hard: 24 cards)</li>
            </ul>
          </TabsContent>

          <TabsContent value="pictures" className="space-y-4 mt-4">
            <h3 className="font-medium text-lg">Picture Matching Mode</h3>
            <p>In Picture mode, you need to match identical emoji cards.</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h4 className="font-medium mb-2">Example:</h4>
              <div className="flex gap-4 justify-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-md flex items-center justify-center text-2xl border">
                  🐶
                </div>
                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-md flex items-center justify-center text-2xl border">
                  🐶
                </div>
              </div>
              <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">Match identical emojis</p>
            </div>
            <p>This mode is great for younger players or for a quick, visual memory challenge.</p>
          </TabsContent>

          <TabsContent value="facts" className="space-y-4 mt-4">
            <h3 className="font-medium text-lg">Fact Matching Mode</h3>
            <p>In Fact mode, you need to match related facts, like countries with their capitals.</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h4 className="font-medium mb-2">Example:</h4>
              <div className="flex gap-4 justify-center">
                <div className="w-24 h-16 bg-white dark:bg-slate-700 rounded-md flex items-center justify-center text-sm border p-2">
                  France
                </div>
                <div className="w-24 h-16 bg-white dark:bg-slate-700 rounded-md flex items-center justify-center text-sm border p-2">
                  Paris
                </div>
              </div>
              <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">
                Match countries with their capitals
              </p>
            </div>
            <p>
              This mode adds an educational element and is more challenging as you need to know or learn the
              relationships between facts.
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
