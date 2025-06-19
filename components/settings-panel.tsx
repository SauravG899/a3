"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { GameMode, Difficulty } from "./memory-game"

interface SettingsPanelProps {
  currentMode: GameMode
  currentDifficulty: Difficulty
  onClose: () => void
  onSave: (mode: GameMode, difficulty: Difficulty) => void
}

export function SettingsPanel({ currentMode, currentDifficulty, onClose, onSave }: SettingsPanelProps) {
  const [mode, setMode] = useState<GameMode>(currentMode)
  const [difficulty, setDifficulty] = useState<Difficulty>(currentDifficulty)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Game Mode</h3>
            <RadioGroup
              defaultValue={mode}
              onValueChange={(value) => setMode(value as GameMode)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pictures" id="pictures" />
                <Label htmlFor="pictures">Picture Matching</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facts" id="facts" />
                <Label htmlFor="facts">Fact Matching</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Difficulty</h3>
            <RadioGroup
              defaultValue={difficulty}
              onValueChange={(value) => setDifficulty(value as Difficulty)}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy">Easy (12 cards)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium (16 cards)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard">Hard (24 cards)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(mode, difficulty)}>Apply Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
