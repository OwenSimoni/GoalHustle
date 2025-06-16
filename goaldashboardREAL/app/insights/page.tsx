"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Calendar, Zap, Award, BarChart3, Flame, Trophy } from "lucide-react"

interface Insight {
  id: string
  type: "success" | "warning" | "info" | "achievement"
  title: string
  description: string
  action?: string
  value?: number
  trend?: "up" | "down" | "stable"
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: "milestone" | "streak" | "performance" | "lifestyle"
}

interface Streak {
  name: string
  current: number
  best: number
  active: boolean
}

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState(0)
  const [monthlyProgress, setMonthlyProgress] = useState(0)
  const [momentum, setMomentum] = useState(0)

  useEffect(() => {
    generateInsights()
    loadAchievements()
    calculateStreaks()
    calculateProgress()
  }, [])

  const generateInsights = () => {
    const goals = JSON.parse(localStorage.getItem("user-goals") || "[]")
    const priorities = JSON.parse(localStorage.getItem("dashboard-priorities") || "[]")
    const businessModels = JSON.parse(localStorage.getItem("business-models") || "[]")

    const newInsights: Insight[] = []

    // Analyze goal progress
    goals.forEach((goal: any) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100
      const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      const dailyRequired = (goal.targetAmount - goal.currentAmount) / Math.max(daysLeft, 1)

      if (progress > 75) {
        newInsights.push({
          id: `goal-${goal.id}-success`,
          type: "success",
          title: `${goal.name} is on track! 🎯`,
          description: `You're ${progress.toFixed(0)}% complete with ${daysLeft} days remaining`,
          trend: "up",
          value: progress,
        })
      } else if (daysLeft < 30 && progress < 50) {
        newInsights.push({
          id: `goal-${goal.id}-warning`,
          type: "warning",
          title: `${goal.name} needs attention ⚠️`,
          description: `Only ${daysLeft} days left but ${progress.toFixed(0)}% complete. Need $${dailyRequired.toFixed(0)}/day`,
          action: "Increase daily actions",
          trend: "down",
        })
      }
    })

    // Analyze task completion
    const completedToday = priorities.filter((p: any) => p.completed).length
    const totalToday = priorities.length

    if (completedToday === totalToday && totalToday > 0) {
      newInsights.push({
        id: "tasks-complete",
        type: "achievement",
        title: "Perfect day! All tasks completed 🔥",
        description: `You completed all ${totalToday} tasks today. This momentum will compound!`,
        trend: "up",
      })
    } else if (completedToday / totalToday > 0.8 && totalToday > 0) {
      newInsights.push({
        id: "tasks-good",
        type: "success",
        title: "Strong execution today 💪",
        description: `${completedToday}/${totalToday} tasks completed. You're building great habits!`,
        trend: "up",
      })
    }

    // Business model insights
    const activeModels = businessModels.filter((m: any) => m.status === "In Progress")
    const systemizedModels = businessModels.filter((m: any) => m.status === "Systemized")

    if (systemizedModels.length > 0) {
      newInsights.push({
        id: "business-systemized",
        type: "achievement",
        title: `${systemizedModels.length} business model${systemizedModels.length > 1 ? "s" : ""} systemized! 🚀`,
        description: "Systemized models generate passive income and scale automatically",
        trend: "up",
      })
    }

    setInsights(newInsights)
  }

  const loadAchievements = () => {
    try {
      const saved = localStorage.getItem("user-achievements")
      if (saved) {
        const parsedAchievements = JSON.parse(saved)
        // Ensure all achievements have string dates
        const processedAchievements: Achievement[] = parsedAchievements.map((achievement: any) => ({
          id: achievement.id || Date.now().toString(),
          title: achievement.title || "Achievement",
          description: achievement.description || "You earned an achievement!",
          icon: achievement.icon || "🏆",
          unlockedAt: typeof achievement.unlockedAt === "string" ? achievement.unlockedAt : new Date().toISOString(),
          category: achievement.category || "milestone",
        }))
        setAchievements(processedAchievements)
      } else {
        // Initialize with some sample achievements
        const initialAchievements: Achievement[] = [
          {
            id: "first-goal",
            title: "Goal Setter",
            description: "Created your first goal",
            icon: "🎯",
            unlockedAt: new Date().toISOString(),
            category: "milestone",
          },
          {
            id: "first-task",
            title: "Task Master",
            description: "Completed your first task",
            icon: "✅",
            unlockedAt: new Date().toISOString(),
            category: "performance",
          },
        ]
        setAchievements(initialAchievements)
        localStorage.setItem("user-achievements", JSON.stringify(initialAchievements))
      }
    } catch (error) {
      console.error("Error loading achievements:", error)
      setAchievements([])
    }
  }

  const calculateStreaks = () => {
    // This would normally calculate from historical data
    const streakData: Streak[] = [
      { name: "Daily Tasks", current: 7, best: 12, active: true },
      { name: "Goal Updates", current: 3, best: 8, active: true },
      { name: "Content Creation", current: 0, best: 5, active: false },
      { name: "Networking", current: 2, best: 4, active: true },
    ]
    setStreaks(streakData)
  }

  const calculateProgress = () => {
    // Calculate weekly and monthly progress
    const goals = JSON.parse(localStorage.getItem("user-goals") || "[]")
    const priorities = JSON.parse(localStorage.getItem("dashboard-priorities") || "[]")

    const completedTasks = priorities.filter((p: any) => p.completed).length
    const totalTasks = priorities.length

    const weeklyProg = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const monthlyProg =
      goals.length > 0
        ? goals.reduce((acc: number, goal: any) => acc + (goal.currentAmount / goal.targetAmount) * 100, 0) /
          goals.length
        : 0

    setWeeklyProgress(weeklyProg)
    setMonthlyProgress(monthlyProg)

    // Calculate momentum (combination of streaks and recent progress)
    const activeStreaks = streaks.filter((s) => s.active).length
    const momentumScore = Math.min(100, weeklyProg * 0.4 + activeStreaks * 15 + monthlyProg * 0.3)
    setMomentum(momentumScore)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "warning":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      case "achievement":
        return <Award className="h-5 w-5 text-purple-600" />
      default:
        return <Zap className="h-5 w-5 text-blue-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:bg-green-950/20"
      case "warning":
        return "border-red-200 bg-red-50 dark:bg-red-950/20"
      case "achievement":
        return "border-purple-200 bg-purple-50 dark:bg-purple-950/20"
      default:
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Recently"
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Recently"

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "Recently"
    }
  }

  const addAchievement = (title: string, description: string, icon: string, category: Achievement["category"]) => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title,
      description,
      icon,
      unlockedAt: new Date().toISOString(),
      category,
    }
    const updatedAchievements = [...achievements, newAchievement]
    setAchievements(updatedAchievements)
    localStorage.setItem("user-achievements", JSON.stringify(updatedAchievements))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Performance Insights
        </h1>
        <p className="text-muted-foreground">Track your momentum and celebrate your wins</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Progress</p>
                <p className="text-2xl font-bold">{weeklyProgress.toFixed(0)}%</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={weeklyProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Progress</p>
                <p className="text-2xl font-bold">{monthlyProgress.toFixed(0)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={monthlyProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Momentum Score</p>
                <p className="text-2xl font-bold">{momentum.toFixed(0)}%</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <Progress value={momentum} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Streaks</p>
                <p className="text-2xl font-bold">{streaks.filter((s) => s.active).length}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Best: {streaks.length > 0 ? Math.max(...streaks.map((s) => s.best)) : 0} days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Insights
          </CardTitle>
          <p className="text-muted-foreground">AI-powered analysis of your progress and performance</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  {insight.action && (
                    <Button size="sm" className="mt-2">
                      {insight.action}
                    </Button>
                  )}
                </div>
                {insight.trend && (
                  <div className="flex items-center gap-1">
                    {insight.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : insight.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete some tasks and update your goals to see insights!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Current Streaks
          </CardTitle>
          <p className="text-muted-foreground">Consistency builds momentum</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streaks.map((streak, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${streak.active ? "border-orange-200 bg-orange-50 dark:bg-orange-950/20" : "border-gray-200 bg-gray-50 dark:bg-gray-950/20"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{streak.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-2xl font-bold ${streak.active ? "text-orange-600" : "text-gray-500"}`}>
                        {streak.current}
                      </span>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Best: {streak.best} days</div>
                  </div>
                  <div className="text-2xl">{streak.active ? "🔥" : "💤"}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <p className="text-muted-foreground">Celebrate your wins</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.slice(0, 5).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{formatDate(achievement.unlockedAt)}</div>
              </div>
            ))}

            {achievements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete goals and tasks to unlock achievements!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
