"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Play, Users, Calendar, Trophy, LogOut } from "lucide-react"
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

export default function DashboardPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      gameNumber: 1,
      players: [
        { id: "1", name: "Player 1", score: 45, currentBreak: 0, highestBreak: 23 },
        { id: "2", name: "Player 2", score: 32, currentBreak: 0, highestBreak: 18 },
      ],
      currentPlayerIndex: 0,
      createdAt: new Date(),
      status: "active",
    },
    {
      id: "2",
      gameNumber: 2,
      players: [
        { id: "3", name: "Alice", score: 67, currentBreak: 0, highestBreak: 34 },
        { id: "4", name: "Bob", score: 89, currentBreak: 0, highestBreak: 42 },
        { id: "5", name: "Charlie", score: 23, currentBreak: 0, highestBreak: 15 },
      ],
      currentPlayerIndex: 1,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      status: "completed",
      winner: "Bob",
    },
  ])

  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false)
  const [newGamePlayers, setNewGamePlayers] = useState<string[]>(["", ""])

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  const addPlayerField = () => {
    setNewGamePlayers([...newGamePlayers, ""])
  }

  const removePlayerField = (index: number) => {
    if (newGamePlayers.length > 2) {
      setNewGamePlayers(newGamePlayers.filter((_, i) => i !== index))
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...newGamePlayers]
    updated[index] = name
    setNewGamePlayers(updated)
  }

  const createGame = () => {
    const validPlayers = newGamePlayers.filter((name) => name.trim() !== "")
    if (validPlayers.length < 2) {
      alert("Please add at least 2 players")
      return
    }

    const newGame: Game = {
      id: Date.now().toString(),
      gameNumber: Math.max(...games.map((g) => g.gameNumber), 0) + 1,
      players: validPlayers.map((name, index) => ({
        id: `${Date.now()}-${index}`,
        name: name.trim(),
        score: 0,
        currentBreak: 0,
        highestBreak: 0,
      })),
      currentPlayerIndex: 0,
      createdAt: new Date(),
      status: "active",
    }

    setGames([newGame, ...games])
    setNewGamePlayers(["", ""])
    setIsCreateGameOpen(false)
  }

  const deleteGame = (gameId: string) => {
    setGames(games.filter((game) => game.id !== gameId))
  }

  const startGame = (gameId: string) => {
    // Store the selected game in localStorage for the game page
    const game = games.find((g) => g.id === gameId)
    if (game) {
      localStorage.setItem("selectedGame", JSON.stringify(game))
      router.push("/game")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Snooker Games</h1>
                <p className="text-muted-foreground">Manage your snooker games and track progress</p>
              </div>

              <div className="flex items-center gap-3">
                <Dialog open={isCreateGameOpen} onOpenChange={setIsCreateGameOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create New Game
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle>Create New Game</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Players</label>
                        {newGamePlayers.map((player, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Player ${index + 1} name`}
                              value={player}
                              onChange={(e) => updatePlayerName(index, e.target.value)}
                              className="flex-1"
                            />
                            {newGamePlayers.length > 2 && (
                              <Button variant="outline" size="sm" onClick={() => removePlayerField(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={addPlayerField}
                          className="w-full"
                          disabled={newGamePlayers.length >= 6}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Player
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsCreateGameOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={createGame} className="flex-1">
                          Create Game
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Games List */}
        <div className="max-w-6xl mx-auto p-4 space-y-4">
          {games.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No games yet</h3>
                <p className="text-muted-foreground mb-4">Create your first snooker game to get started</p>
                <Button onClick={() => setIsCreateGameOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Game
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {games.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold">#{game.gameNumber}</div>
                          <div className="text-xs text-muted-foreground">Game</div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{game.players.map((p) => p.name).join(" vs ")}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {game.createdAt.toLocaleDateString()}
                            <Users className="w-4 h-4 ml-2" />
                            {game.players.length} players
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={game.status === "active" ? "default" : "secondary"}>
                          {game.status === "active" ? "Active" : "Completed"}
                        </Badge>
                        {game.winner && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Winner: {game.winner}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Player Scores */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {game.players.map((player, index) => (
                          <div
                            key={player.id}
                            className={`p-3 rounded-lg border ${
                              game.currentPlayerIndex === index && game.status === "active"
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="text-sm font-medium truncate">{player.name}</div>
                            <div className="text-xl font-bold">{player.score}</div>
                            <div className="text-xs text-muted-foreground">Best: {player.highestBreak}</div>
                            {game.currentPlayerIndex === index && game.status === "active" && (
                              <Badge variant="default" className="text-xs mt-1">
                                Current
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => startGame(game.id)}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {game.status === "active" ? "Continue Game" : "View Game"}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="sm:w-auto">
                              <Trash2 className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Game</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete Game #{game.gameNumber}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteGame(game.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
