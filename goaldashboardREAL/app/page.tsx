"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Check, X, Target, DollarSign, Users, UserCheck, Zap, Clock } from "lucide-react"
import Link from "next/link"

interface Goal {
  id: string
  name: string
  current: number
  target: number
  unit: string
}

interface UserGoal {
  id: string
  name: string
  currentAmount: number
  targetAmount: number
  targetDate: string
  category: string
  description: string
  priority: "High" | "Medium" | "Low"
}

interface Priority {
  id: string
  text: string
  completed: boolean
}

interface GeneratedTask {
  task: string
  reason: string
  priority: "High" | "Medium" | "Low"
  impact: string
}

interface BusinessModel {
  id: string
  name: string
  incomeModel: string
  status: "Not Started" | "In Progress" | "Systemized"
  description: string
  tasks: any[]
}

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Monthly Revenue", current: 5000, target: 15000, unit: "$" },
    { id: "2", name: "Followers", current: 2500, target: 50000, unit: "" },
    { id: "3", name: "Active Clients", current: 8, target: 25, unit: "" },
  ])

  const [userGoals, setUserGoals] = useState<UserGoal[]>([])
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [newPriority, setNewPriority] = useState("")
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ current: 0, target: 0 })

  useEffect(() => {
    const savedGoals = localStorage.getItem("dashboard-goals")
    const savedPriorities = localStorage.getItem("dashboard-priorities")
    const savedUserGoals = localStorage.getItem("user-goals")

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
    if (savedPriorities) {
      setPriorities(JSON.parse(savedPriorities))
    }
    if (savedUserGoals) {
      const parsedUserGoals = JSON.parse(savedUserGoals)
      setUserGoals(parsedUserGoals)

      // Sync MRR with highest income goal
      const incomeGoals = parsedUserGoals.filter((g: any) => g.category === "Income")
      if (incomeGoals.length > 0) {
        const highestIncomeGoal = incomeGoals.reduce((prev: any, current: any) =>
          current.targetAmount > prev.targetAmount ? current : prev,
        )
        setGoals((prev) =>
          prev.map((goal) =>
            goal.name === "Monthly Revenue"
              ? { ...goal, current: highestIncomeGoal.currentAmount, target: highestIncomeGoal.targetAmount }
              : goal,
          ),
        )
      }
    }

    generateDailyTasks()
  }, [])

  useEffect(() => {
    localStorage.setItem("dashboard-goals", JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem("dashboard-priorities", JSON.stringify(priorities))
  }, [priorities])

  const generateDailyTasks = () => {
    const businessModels: BusinessModel[] = JSON.parse(localStorage.getItem("business-models") || "[]")
    const currentIncome = goals.find((g) => g.name === "Monthly Revenue")?.current || 0

    const tasks: GeneratedTask[] = []

    // Generate tasks based on active business models
    businessModels.forEach((model) => {
      if (model.status === "In Progress") {
        if (model.name.toLowerCase().includes("content") || model.name.toLowerCase().includes("creator")) {
          tasks.push({
            task: "Create and post 3 pieces of content across platforms",
            reason: `Building audience for ${model.name} - content drives growth`,
            priority: "High",
            impact: "Audience growth & brand building",
          })
          tasks.push({
            task: "Reach out to 5 brands for partnership opportunities",
            reason: "Monetize your growing audience through brand deals",
            priority: "Medium",
            impact: "Revenue diversification",
          })
        } else if (model.name.toLowerCase().includes("consulting") || model.name.toLowerCase().includes("coaching")) {
          tasks.push({
            task: "Conduct 3 high-value discovery calls",
            reason: `Direct path to closing ${model.incomeModel} deals`,
            priority: "High",
            impact: "Revenue generation",
          })
          tasks.push({
            task: "Follow up with 5 warm prospects",
            reason: "Converting existing leads is the fastest path to revenue",
            priority: "High",
            impact: "Sales conversion",
          })
        } else if (model.name.toLowerCase().includes("agency") || model.name.toLowerCase().includes("service")) {
          tasks.push({
            task: "Deliver exceptional results for current clients",
            reason: "Client success leads to referrals and retention",
            priority: "High",
            impact: "Client satisfaction & referrals",
          })
          tasks.push({
            task: "Pitch 5 potential new clients",
            reason: "Consistent sales activity drives agency growth",
            priority: "High",
            impact: "Client acquisition",
          })
        }
      } else if (model.status === "Not Started") {
        tasks.push({
          task: `Start building ${model.name} - complete setup tasks`,
          reason: "Getting started is the hardest part - take the first step",
          priority: "High",
          impact: "Business foundation",
        })
      }
    })

    // Income-based tasks if no specific business model tasks
    if (tasks.length === 0) {
      if (currentIncome < 5000) {
        tasks.push({
          task: "Set up your business model in the Business section",
          reason: "Define your revenue strategy to generate specific daily actions",
          priority: "High",
          impact: "Strategic foundation",
        })
        tasks.push({
          task: "Make 10 cold outreach calls/messages",
          reason: "Direct outreach creates immediate opportunities",
          priority: "High",
          impact: "Lead generation",
        })
      } else if (currentIncome < 10000) {
        tasks.push({
          task: "Follow up with 5 warm leads",
          reason: "Converting existing leads is the fastest path to revenue",
          priority: "High",
          impact: "Revenue conversion",
        })
        tasks.push({
          task: "Create valuable content for your audience",
          reason: "Content builds authority and attracts opportunities",
          priority: "Medium",
          impact: "Brand building",
        })
      } else {
        tasks.push({
          task: "Focus on premium clients and raise your prices",
          reason: "Higher income requires higher-value work",
          priority: "High",
          impact: "Revenue optimization",
        })
        tasks.push({
          task: "Build systems to scale your business",
          reason: "Systemization enables growth beyond personal time",
          priority: "Medium",
          impact: "Business scaling",
        })
      }
    }

    setGeneratedTasks(tasks.slice(0, 4))
  }

  const addGeneratedTaskToPriorities = (task: GeneratedTask) => {
    const priority: Priority = {
      id: Date.now().toString(),
      text: task.task,
      completed: false,
    }
    setPriorities([...priorities, priority])
    setGeneratedTasks(generatedTasks.filter((t) => t.task !== task.task))
  }

  const updateGoal = (id: string, current: number, target: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, current, target } : goal)))
    setEditingGoal(null)
    generateDailyTasks()
  }

  const addPriority = () => {
    if (newPriority.trim()) {
      const priority: Priority = {
        id: Date.now().toString(),
        text: newPriority.trim(),
        completed: false,
      }
      setPriorities([...priorities, priority])
      setNewPriority("")
    }
  }

  const togglePriority = (id: string) => {
    setPriorities(priorities.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)))
  }

  const deletePriority = (id: string) => {
    setPriorities(priorities.filter((p) => p.id !== id))
  }

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal.id)
    setEditValues({ current: goal.current, target: goal.target })
  }

  const cancelEditing = () => {
    setEditingGoal(null)
    setEditValues({ current: 0, target: 0 })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-200 bg-red-50 dark:bg-red-950/20"
      case "Medium":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
      case "Low":
        return "border-green-200 bg-green-50 dark:bg-green-950/20"
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950/20"
    }
  }

  const getGoalIcon = (name: string) => {
    if (name.includes("Revenue") || name.includes("Income")) return <DollarSign className="h-6 w-6 text-green-600" />
    if (name.includes("Followers")) return <Users className="h-6 w-6 text-blue-600" />
    if (name.includes("Clients")) return <UserCheck className="h-6 w-6 text-purple-600" />
    return <Target className="h-6 w-6 text-gray-600" />
  }

  const getCompletionRate = () => {
    if (priorities.length === 0) return 0
    return (priorities.filter((p) => p.completed).length / priorities.length) * 100
  }

  const getTopPriorityGoal = () => {
    if (userGoals.length === 0) return null

    // Find the highest priority goal that's not completed
    const highPriorityGoals = userGoals.filter((g) => g.priority === "High")
    if (highPriorityGoals.length > 0) {
      return highPriorityGoals.reduce((prev, current) => {
        const prevProgress = prev.currentAmount / prev.targetAmount
        const currentProgress = current.currentAmount / current.targetAmount
        // Prioritize goals with less progress
        return currentProgress < prevProgress ? current : prev
      })
    }

    // If no high priority, return the first goal
    return userGoals[0]
  }

  const calculateMRRNeeded = (goal: UserGoal) => {
    const daysLeft = Math.max(1, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30))
    const amountNeeded = goal.targetAmount - goal.currentAmount
    return Math.ceil(amountNeeded / monthsLeft)
  }

  const topPriorityGoal = getTopPriorityGoal()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Track your goals and execute daily</p>
      </div>

      {/* Top Priority Goal - Featured */}
      {topPriorityGoal && (
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8" />
                <div>
                  <h2 className="text-3xl font-bold">Primary Focus</h2>
                  <p className="text-blue-100">Your #1 priority goal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{topPriorityGoal.name}</h3>
                    <p className="text-blue-100 mt-1">{topPriorityGoal.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>${topPriorityGoal.currentAmount.toLocaleString()}</span>
                      <span>${topPriorityGoal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4">
                      <div
                        className="bg-white h-4 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (topPriorityGoal.currentAmount / topPriorityGoal.targetAmount) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-blue-100">
                      <span>
                        {Math.round((topPriorityGoal.currentAmount / topPriorityGoal.targetAmount) * 100)}% complete
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.ceil(
                          (new Date(topPriorityGoal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        days left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-blue-100">Funds Needed</div>
                      <div className="text-2xl font-bold">
                        ${(topPriorityGoal.targetAmount - topPriorityGoal.currentAmount).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-blue-100">MRR Needed</div>
                      <div className="text-2xl font-bold">
                        ${calculateMRRNeeded(topPriorityGoal).toLocaleString()}/mo
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-blue-100">Target Date</div>
                    <div className="text-xl font-bold">
                      {new Date(topPriorityGoal.targetDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-blue-100">Daily Target</div>
                    <div className="text-xl font-bold">
                      $
                      {Math.ceil(
                        (topPriorityGoal.targetAmount - topPriorityGoal.currentAmount) /
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date(topPriorityGoal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                            ),
                          ),
                      ).toLocaleString()}
                      /day
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getGoalIcon(goal.name)}
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(goal)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingGoal === goal.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Current"
                      value={editValues.current}
                      onChange={(e) => setEditValues({ ...editValues, current: Number(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="Target"
                      value={editValues.target}
                      onChange={(e) => setEditValues({ ...editValues, target: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateGoal(goal.id, editValues.current, editValues.target)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {goal.unit}
                    {goal.current.toLocaleString()}
                    <span className="text-lg text-muted-foreground font-normal">
                      {" "}
                      / {goal.unit}
                      {goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {Math.round((goal.current / goal.target) * 100)}% Complete
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Groups CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Join a Circle</h2>
            </div>
            <p className="text-lg">Connect with like-minded entrepreneurs, share goals, and achieve more together.</p>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <p className="font-semibold text-purple-700 dark:text-purple-300">
                Create or join a circle to unlock group features like leaderboards, chat, and accountability.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/groups">
                <Users className="h-4 w-4 mr-2" />
                Explore Groups
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Smart Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-600" />
            Smart Action Plan
          </CardTitle>
          <p className="text-muted-foreground">AI-generated tasks based on your business model and goals</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedTasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 ${getPriorityColor(task.priority)} hover:shadow-md transition-shadow`}
            >
              <div className="flex-1 space-y-2">
                <div className="font-semibold">{task.task}</div>
                <div className="text-sm text-muted-foreground">{task.reason}</div>
                <div className="text-xs text-blue-600 font-medium">Impact: {task.impact}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.priority}
                </span>
                <Button size="sm" onClick={() => addGeneratedTaskToPriorities(task)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Today's Tasks
            <span className="text-sm font-normal text-muted-foreground">
              ({priorities.filter((p) => p.completed).length}/{priorities.length} completed)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a task for today..."
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPriority()}
              className="flex-1"
            />
            <Button onClick={addPriority}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {priorities.map((priority) => (
              <div
                key={priority.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  priority.completed
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-background hover:bg-muted/50 border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={priority.completed}
                  onChange={() => togglePriority(priority.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className={`flex-1 ${priority.completed ? "line-through text-muted-foreground" : ""}`}>
                  {priority.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePriority(priority.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {priorities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks scheduled yet. Add tasks from the action plan above!</p>
              </div>
            )}
          </div>

          {/* Progress Summary */}
          {priorities.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Today's Progress</span>
                <span className="text-sm text-muted-foreground">
                  {priorities.filter((p) => p.completed).length} of {priorities.length} completed
                </span>
              </div>
              <Progress value={getCompletionRate()} className="h-2" />
              <div className="mt-2 text-sm text-muted-foreground">
                {getCompletionRate() === 100
                  ? "🎉 Perfect execution! You're building unstoppable momentum."
                  : getCompletionRate() > 75
                    ? "💪 Strong progress! Push through to finish strong."
                    : getCompletionRate() > 50
                      ? "⚡ Good momentum. Keep executing to hit your targets."
                      : "🎯 Time to focus. Every completed task moves you closer to your goals."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
