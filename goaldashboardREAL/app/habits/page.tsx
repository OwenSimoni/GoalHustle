"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Check, X, Flame, Target, TrendingUp } from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string
  category: "Health" | "Business" | "Personal" | "Learning"
  targetFrequency: number // times per week
  currentStreak: number
  bestStreak: number
  completedToday: boolean
  completedThisWeek: number
  linkedGoal?: string
}

interface HabitLog {
  habitId: string
  date: string
  completed: boolean
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "Business" as Habit["category"],
    targetFrequency: 7,
  })

  useEffect(() => {
    loadHabits()
    loadHabitLogs()
  }, [])

  useEffect(() => {
    localStorage.setItem("user-habits", JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem("habit-logs", JSON.stringify(habitLogs))
  }, [habitLogs])

  const loadHabits = () => {
    const saved = localStorage.getItem("user-habits")
    if (saved) {
      setHabits(JSON.parse(saved))
    } else {
      // Initialize with some default habits
      const defaultHabits: Habit[] = [
        {
          id: "1",
          name: "Morning Planning",
          description: "Plan the day's priorities and goals",
          category: "Business",
          targetFrequency: 7,
          currentStreak: 0,
          bestStreak: 0,
          completedToday: false,
          completedThisWeek: 0,
        },
        {
          id: "2",
          name: "Cold Outreach",
          description: "Make calls or send messages to prospects",
          category: "Business",
          targetFrequency: 5,
          currentStreak: 0,
          bestStreak: 0,
          completedToday: false,
          completedThisWeek: 0,
        },
        {
          id: "3",
          name: "Content Creation",
          description: "Create valuable content for audience",
          category: "Business",
          targetFrequency: 5,
          currentStreak: 0,
          bestStreak: 0,
          completedToday: false,
          completedThisWeek: 0,
        },
      ]
      setHabits(defaultHabits)
    }
  }

  const loadHabitLogs = () => {
    const saved = localStorage.getItem("habit-logs")
    if (saved) {
      setHabitLogs(JSON.parse(saved))
    }
  }

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        ...newHabit,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: false,
        completedThisWeek: 0,
      }
      setHabits([...habits, habit])
      setNewHabit({
        name: "",
        description: "",
        category: "Business",
        targetFrequency: 7,
      })
      setShowAddHabit(false)
    }
  }

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return

    const newCompleted = !habit.completedToday

    // Update habit
    setHabits(
      habits.map((h) => {
        if (h.id === habitId) {
          const newStreak = newCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1)
          return {
            ...h,
            completedToday: newCompleted,
            currentStreak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
            completedThisWeek: newCompleted ? h.completedThisWeek + 1 : Math.max(0, h.completedThisWeek - 1),
          }
        }
        return h
      }),
    )

    // Update logs
    const existingLog = habitLogs.find((log) => log.habitId === habitId && log.date === today)
    if (existingLog) {
      setHabitLogs(
        habitLogs.map((log) =>
          log.habitId === habitId && log.date === today ? { ...log, completed: newCompleted } : log,
        ),
      )
    } else {
      setHabitLogs([...habitLogs, { habitId, date: today, completed: newCompleted }])
    }
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setHabitLogs(habitLogs.filter((log) => log.habitId !== habitId))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Health":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Personal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Learning":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getWeeklyProgress = (habit: Habit) => {
    return (habit.completedThisWeek / habit.targetFrequency) * 100
  }

  const getTotalCompletedToday = () => {
    return habits.filter((h) => h.completedToday).length
  }

  const getAverageStreak = () => {
    if (habits.length === 0) return 0
    return habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Success Habits
          </h1>
          <p className="text-muted-foreground">Build the daily habits that drive your goals</p>
        </div>
        <Button onClick={() => setShowAddHabit(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">
                  {getTotalCompletedToday()}/{habits.length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Streak</p>
                <p className="text-2xl font-bold">{getAverageStreak().toFixed(1)}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold">{Math.max(...habits.map((h) => h.bestStreak), 0)}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Habits</p>
                <p className="text-2xl font-bold">{habits.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Habit Form */}
      {showAddHabit && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  placeholder="e.g., Morning workout"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as Habit["category"] })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Personal">Personal</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Brief description of the habit"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Frequency (times per week)</label>
              <Input
                type="number"
                min="1"
                max="7"
                value={newHabit.targetFrequency}
                onChange={(e) => setNewHabit({ ...newHabit, targetFrequency: Number(e.target.value) })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addHabit}>Add Habit</Button>
              <Button variant="outline" onClick={() => setShowAddHabit(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className={`relative ${habit.completedToday ? "ring-2 ring-green-500" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                  <Badge className={getCategoryColor(habit.category)}>{habit.category}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Today's Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Today</span>
                <Button
                  variant={habit.completedToday ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleHabit(habit.id)}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  {habit.completedToday ? "Done" : "Mark Done"}
                </Button>
              </div>

              {/* Weekly Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span>
                    {habit.completedThisWeek}/{habit.targetFrequency}
                  </span>
                </div>
                <Progress value={getWeeklyProgress(habit)} className="h-2" />
              </div>

              {/* Streaks */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-orange-600">{habit.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{habit.bestStreak}</div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {habits.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Habits Yet</h3>
              <p className="text-muted-foreground mb-4">Start building success habits that support your goals</p>
              <Button onClick={() => setShowAddHabit(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
