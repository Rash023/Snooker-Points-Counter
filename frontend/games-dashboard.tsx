"use client"

import { useEffect, useState } from "react"
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
import { Plus, Trash2, Play, Users, Calendar, Trophy } from "lucide-react"

interface Player {
  id: string
  name: string
  points: number
}

interface Game {
  id: string
  gameNo: number
  players: Player[]
}

interface GamesDashboardProps {
  onStartGame: (game: Game) => void
}

export default function GamesDashboard({ onStartGame }: GamesDashboardProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false)
  const [newGamePlayers, setNewGamePlayers] = useState<string[]>(["", ""])
  const [gameToDelete, setGameToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/allGames`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch games");
        const json = await res.json();
        console.log("API response:", json);
        setGames(json.games); // ✅ make sure this matches the actual structure
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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

 const createGame = async () => {
  const validPlayers = newGamePlayers.filter((name) => name.trim() !== "");
  if (validPlayers.length < 2) {
    alert("Please add at least 2 players");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        players: validPlayers.map((name) => ({ name })),
      }),
    });

    if (!res.ok) throw new Error("Failed to create game");


    setNewGamePlayers(["", ""]);
    setIsCreateGameOpen(false);
  } catch (error) {
    console.error("Error creating game:", error);
    alert("Failed to create game");
  }
};

  const deleteGame = (gameId: string) => {
    setGames(games.filter((game) => game.id !== gameId))
    setGameToDelete(null)
  }

  const getHighestScore = (players: Player[]) => {
    return Math.max(...players.map((p) => p.points))
  }

  const getWinner = (players: Player[]) => {
    const highestScore = getHighestScore(players)
    const winners = players.filter((p) => p.points === highestScore)
    return winners.length === 1 ? winners[0].name : null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Snooker Games</h1>
              <p className="text-muted-foreground">Manage your snooker games and track progress</p>
            </div>

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
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading games...
            </CardContent>
          </Card>
        ) : games.length === 0 ? (
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
                        <div className="text-2xl font-bold">#{game.gameNo}</div>
                        <div className="text-xs text-muted-foreground">Game</div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{game.players.map((p) => p.name).join(" vs ")}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <Users className="w-4 h-4 ml-2" />
                          {game.players.length} players
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {game.players.map((player, index) => (
                        <div
                          key={player.id}
                          className={`p-3 rounded-lg border `}
                        >
                          <div className="text-sm font-medium truncate">{player.name}</div>
                          <div className="text-xl font-bold">{player.points}</div>
                          
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => onStartGame(game)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                       
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
                              Are you sure you want to delete Game #{game.gameNo}? This action cannot be undone.
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
  )
}
