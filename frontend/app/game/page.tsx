"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RotateCcw, Plus, Minus, Edit, Users, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Footer from "../../components/footer"

interface Player {
  id: string
  name: string
  score: number
  currentBreak: number
  highestBreak: number
}

interface Game {
  id: string
  gameNumber: number
  players: Player[]
  currentPlayerIndex: number
  createdAt: Date
  status: "active" | "completed"
  winner?: string
}

const ballValues = [
  { name: "Red", value: 1, color: "bg-red-500" },
  { name: "Yellow", value: 2, color: "bg-yellow-500" },
  { name: "Green", value: 3, color: "bg-green-500" },
  { name: "Brown", value: 4, color: "bg-amber-700" },
  { name: "Blue", value: 5, color: "bg-blue-500" },
  { name: "Pink", value: 6, color: "bg-pink-500" },
  { name: "Black", value: 7, color: "bg-black" },
]

export default function GamePage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Player 1", score: 0, currentBreak: 0, highestBreak: 0 },
    { id: "2", name: "Player 2", score: 0, currentBreak: 0, highestBreak: 0 },
  ])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gameNumber, setGameNumber] = useState(1)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [isManagePlayersOpen, setIsManagePlayersOpen] = useState(false)

  const foulValues = [
    { name: "Standard Foul", value: -4, description: "Cue ball potted, wrong ball hit first" },
    { name: "Blue Foul", value: -5, description: "Foul involving blue ball" },
    { name: "Pink Foul", value: -6, description: "Foul involving pink ball" },
    { name: "Black Foul", value: -7, description: "Foul involving black ball" },
  ]

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load selected game if available
    const selectedGameData = localStorage.getItem("selectedGame")
    if (selectedGameData) {
      const game: Game = JSON.parse(selectedGameData)
      setPlayers(game.players)
      setCurrentPlayerIndex(game.currentPlayerIndex)
      setGameNumber(game.gameNumber)
    }
  }, [router])

  const applyFoulPenalty = (points: number) => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index === currentPlayerIndex) {
          return {
            ...player,
            score: Math.max(0, player.score + points),
            currentBreak: 0,
          }
        }
        return player
      }),
    )
  }

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0,
        currentBreak: 0,
        highestBreak: 0,
      }
      setPlayers([...players, newPlayer])
      setNewPlayerName("")
    }
  }

  const removePlayer = (playerId: string) => {
    if (players.length > 1) {
      const playerIndex = players.findIndex((p) => p.id === playerId)
      setPlayers(players.filter((p) => p.id !== playerId))

      if (currentPlayerIndex >= players.length - 1) {
        setCurrentPlayerIndex(0)
      } else if (playerIndex <= currentPlayerIndex) {
        setCurrentPlayerIndex(Math.max(0, currentPlayerIndex - 1))
      }
    }
  }

  const updatePlayerName = (playerId: string, newName: string) => {
    if (newName.trim()) {
      setPlayers(players.map((p) => (p.id === playerId ? { ...p, name: newName.trim() } : p)))
      setEditingPlayer(null)
      setEditName("")
    }
  }

  const addPoints = (points: number) => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index === currentPlayerIndex) {
          const newCurrentBreak = player.currentBreak + points
          return {
            ...player,
            score: player.score + points,
            currentBreak: newCurrentBreak,
            highestBreak: Math.max(player.highestBreak, newCurrentBreak),
          }
        }
        return player
      }),
    )
  }

  const endBreak = () => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index === currentPlayerIndex) {
          return { ...player, currentBreak: 0 }
        }
        return player
      }),
    )
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length)
  }

  const resetGame = () => {
    setPlayers(
      players.map((player) => ({
        ...player,
        score: 0,
        currentBreak: 0,
        highestBreak: 0,
      })),
    )
    setCurrentPlayerIndex(0)
  }

  const resetAllPlayers = () => {
    setPlayers([
      { id: "1", name: "Player 1", score: 0, currentBreak: 0, highestBreak: 0 },
      { id: "2", name: "Player 2", score: 0, currentBreak: 0, highestBreak: 0 },
    ])
    setCurrentPlayerIndex(0)
    setGameNumber(1)
  }

  const nextGame = () => {
    resetGame()
    setGameNumber((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm sm:text-base hover:text-gray-600">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Games</span>
                <span className="sm:hidden">Games</span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                <h1 className="text-lg sm:text-xl font-bold text-center">Snooker Counter</h1>
              </div>

              <Dialog open={isManagePlayersOpen} onOpenChange={setIsManagePlayersOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Players</span>
                    <span className="sm:hidden">({players.length})</span>
                    <span className="hidden sm:inline">({players.length})</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Manage Players</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter player name"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                        className="text-sm"
                      />
                      <Button onClick={addPlayer} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                      {players.map((player, index) => (
                        <div key={player.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                          {editingPlayer === player.id ? (
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") updatePlayerName(player.id, editName)
                                if (e.key === "Escape") {
                                  setEditingPlayer(null)
                                  setEditName("")
                                }
                              }}
                              onBlur={() => updatePlayerName(player.id, editName)}
                              autoFocus
                              className="flex-1 text-sm"
                            />
                          ) : (
                            <>
                              <span className="flex-1 truncate">{player.name}</span>
                              {currentPlayerIndex === index && (
                                <Badge variant="default" className="text-xs">
                                  Current
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingPlayer(player.id)
                                  setEditName(player.name)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePlayer(player.id)}
                                disabled={players.length <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button variant="destructive" onClick={resetAllPlayers} className="w-full text-sm">
                      Reset All Players
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-3 sm:space-y-6">
          {/* Game Number */}
          <Card>
            <CardContent className="py-2 sm:py-4">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGameNumber(Math.max(1, gameNumber - 1))}
                  disabled={gameNumber <= 1}
                  className="h-8 sm:h-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold">Game {gameNumber}</div>
                  <div className="text-xs text-muted-foreground">Current Frame</div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGameNumber(gameNumber + 1)}
                  className="h-8 sm:h-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Player Scores - Desktop: All players, Mobile: Current player only */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {players.map((player, index) => (
              <Card key={player.id} className={`${currentPlayerIndex === index ? "ring-2 ring-primary" : ""}`}>
                <CardHeader className="pb-1 sm:pb-3">
                  <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                    <span className="truncate">{player.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 sm:py-4">
                  <div className="space-y-1 sm:space-y-3">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{player.score}</div>
                      <div className="text-xs text-muted-foreground">Total Score</div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <div className="font-medium">Current Break</div>
                        <div className="text-sm sm:text-base">{player.currentBreak}</div>
                      </div>
                      <div>
                        <div className="font-medium">Highest Break</div>
                        <div className="text-sm sm:text-base">{player.highestBreak}</div>
                      </div>
                    </div>
                    {currentPlayerIndex === index && (
                      <Badge variant="default" className="w-full justify-center text-xs">
                        Current Player
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile: Single Current Player Card */}
          <div className="sm:hidden">
            <Card className="ring-2 ring-primary">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="truncate">{players[currentPlayerIndex]?.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    Player {currentPlayerIndex + 1} of {players.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-1">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{players[currentPlayerIndex]?.score}</div>
                    <div className="text-xs text-muted-foreground">Total Score</div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <div className="font-medium">Current Break</div>
                      <div className="text-sm">{players[currentPlayerIndex]?.currentBreak}</div>
                    </div>
                    <div>
                      <div className="font-medium">Highest Break</div>
                      <div className="text-sm">{players[currentPlayerIndex]?.highestBreak}</div>
                    </div>
                  </div>
                  <Badge variant="default" className="w-full justify-center text-xs">
                    Current Player
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Players Summary - Mobile Only */}
          <div className="sm:hidden">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">All Players</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-2">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                      <span className={`truncate ${currentPlayerIndex === index ? "font-bold" : ""}`}>
                        {player.name}
                      </span>
                      <span className={`font-medium ${currentPlayerIndex === index ? "font-bold text-primary" : ""}`}>
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ball Buttons */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Score Points - {players[currentPlayerIndex]?.name}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 sm:py-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                {ballValues.map((ball) => (
                  <Button
                    key={ball.name}
                    onClick={() => addPoints(ball.value)}
                    className={`h-10 sm:h-16 flex flex-col gap-0 sm:gap-1 text-white hover:opacity-80 ${ball.color}`}
                    variant="default"
                  >
                    <span className="font-bold text-sm sm:text-lg">{ball.value}</span>
                    <span className="text-xs leading-tight">{ball.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Foul Points */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-red-600 text-sm sm:text-base">
                Foul Penalties - {players[currentPlayerIndex]?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 sm:py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {foulValues.map((foul) => (
                  <Button
                    key={foul.name}
                    onClick={() => applyFoulPenalty(foul.value)}
                    variant="destructive"
                    className="h-10 sm:h-16 flex flex-col gap-0 sm:gap-1"
                  >
                    <span className="font-bold text-sm sm:text-lg">{foul.value}</span>
                    <span className="text-xs leading-tight">{foul.name.split(" ")[0]} Foul</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button onClick={endBreak} variant="outline" className="flex-1 text-sm sm:text-base h-10 sm:h-11">
              End Break / Next Player
            </Button>
            <Button onClick={resetGame} variant="secondary" className="flex-1 text-sm sm:text-base h-10 sm:h-11">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Scores
            </Button>
            <Button onClick={nextGame} variant="default" className="flex-1 text-sm sm:text-base h-10 sm:h-11">
              Next Game
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
