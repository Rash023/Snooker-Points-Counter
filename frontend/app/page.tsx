"use client"

import { useState } from "react"
import LoginPage from "../login-page"
import SignupPage from "../signup-page"
import GamesDashboard from "../games-dashboard"
import SnookerCounter from "../snooker-counter"

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

type AppView = "login" | "signup" | "dashboard" | "game"

export default function Page() {
  const [currentView, setCurrentView] = useState<AppView>("login")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleSignup = () => {
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleStartGame = (game: Game) => {
    setSelectedGame(game)
    setCurrentView("game")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedGame(null)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView("login")
    setSelectedGame(null)
  }

  // Authentication views
  if (!isAuthenticated) {
    switch (currentView) {
      case "signup":
        return <SignupPage onSignup={handleSignup} onGoToLogin={() => setCurrentView("login")} />
      default:
        return <LoginPage onLogin={handleLogin} onGoToSignup={() => setCurrentView("signup")} />
    }
  }

  // Authenticated views
  switch (currentView) {
    case "game":
      return <SnookerCounter initialGame={selectedGame} onBackToDashboard={handleBackToDashboard} />
    default:
      return <GamesDashboard onStartGame={handleStartGame} />
  }
}
