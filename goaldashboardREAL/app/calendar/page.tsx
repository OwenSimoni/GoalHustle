"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, DollarSign, Target, Zap, CheckCircle, Circle, TrendingUp } from "lucide-react"

interface CalendarTask {
  id: string
  text: string
  type: "daily" | "mrr_checkpoint" | "goal_milestone" | "business_task"
  priority: "High" | "Medium" | "Low"
  completed: boolean
  amount?: number
  category?: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  tasks: CalendarTask[]
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

  useEffect(() => {
    generateCalendar()
  }, [currentDate])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and how many days in month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Get first day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay()

    // Calculate days to show (including previous/next month)
    const days: CalendarDay[] = []

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        tasks: [],
      })
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        tasks: generateTasksForDay(date),
      })
    }

    // Add days from next month to complete the grid (42 days total - 6 weeks)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        tasks: [],
      })
    }

    setCalendarDays(days)
  }

  const generateTasksForDay = (date: Date): CalendarTask[] => {
    const tasks: CalendarTask[] = []
    const dayOfMonth = date.getDate()
    const dayOfWeek = date.getDay()

    // Get user data
    const goals = JSON.parse(localStorage.getItem("user-goals") || "[]")
    const businessModels = JSON.parse(localStorage.getItem("business-models") || "[]")
    const dashboardGoals = JSON.parse(localStorage.getItem("dashboard-goals") || "[]")

    // Get current MRR
    const currentMRR = dashboardGoals.find((g: any) => g.name === "Monthly Revenue")?.current || 0

    // MRR Checkpoints (every 5 days)
    if (dayOfMonth % 5 === 0) {
      const targetMRR = Math.ceil(currentMRR * (1 + dayOfMonth / 100)) // Gradual increase
      tasks.push({
        id: `mrr-${date.toISOString()}`,
        text: `MRR Checkpoint: $${targetMRR.toLocaleString()}`,
        type: "mrr_checkpoint",
        priority: "High",
        completed: false,
        amount: targetMRR,
        category: "Revenue",
      })
    }

    // Goal Milestones (specific dates based on goal target dates)
    goals.forEach((goal: any) => {
      const targetDate = new Date(goal.targetDate)
      const daysUntilTarget = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

      if (daysUntilTarget > 0) {
        const milestoneInterval = Math.max(7, Math.floor(daysUntilTarget / 10)) // Every 7-10 days
        const daysSinceStart = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        if (daysSinceStart > 0 && daysSinceStart % milestoneInterval === 0) {
          const progressTarget =
            goal.currentAmount + (goal.targetAmount - goal.currentAmount) * (daysSinceStart / daysUntilTarget)
          tasks.push({
            id: `goal-${goal.id}-${date.toISOString()}`,
            text: `${goal.name}: $${Math.round(progressTarget).toLocaleString()}`,
            type: "goal_milestone",
            priority: goal.priority,
            completed: false,
            amount: Math.round(progressTarget),
            category: goal.category,
          })
        }
      }
    })

    // Daily Business Tasks (based on active business models)
    businessModels.forEach((model: any) => {
      if (model.status === "In Progress") {
        // Different tasks for different days of week
        if (dayOfWeek === 1) {
          // Monday - Planning
          tasks.push({
            id: `business-${model.id}-${date.toISOString()}-planning`,
            text: `Plan ${model.name} week strategy`,
            type: "business_task",
            priority: "High",
            completed: false,
            category: model.name,
          })
        } else if (dayOfWeek === 3) {
          // Wednesday - Execution
          if (model.name.toLowerCase().includes("content")) {
            tasks.push({
              id: `business-${model.id}-${date.toISOString()}-content`,
              text: "Create 3 pieces of content",
              type: "business_task",
              priority: "High",
              completed: false,
              category: model.name,
            })
          } else if (model.name.toLowerCase().includes("consulting")) {
            tasks.push({
              id: `business-${model.id}-${date.toISOString()}-calls`,
              text: "Conduct 3 discovery calls",
              type: "business_task",
              priority: "High",
              completed: false,
              category: model.name,
            })
          } else if (model.name.toLowerCase().includes("agency")) {
            tasks.push({
              id: `business-${model.id}-${date.toISOString()}-clients`,
              text: "Deliver client work & follow up",
              type: "business_task",
              priority: "High",
              completed: false,
              category: model.name,
            })
          }
        } else if (dayOfWeek === 5) {
          // Friday - Review
          tasks.push({
            id: `business-${model.id}-${date.toISOString()}-review`,
            text: `Review ${model.name} weekly performance`,
            type: "business_task",
            priority: "Medium",
            completed: false,
            category: model.name,
          })
        }
      }
    })

    // Daily Execution Tasks (every day)
    if (currentMRR < 5000) {
      tasks.push({
        id: `daily-${date.toISOString()}-outreach`,
        text: "10 cold outreach messages",
        type: "daily",
        priority: "High",
        completed: false,
      })
    } else if (currentMRR < 15000) {
      tasks.push({
        id: `daily-${date.toISOString()}-leads`,
        text: "Follow up with 5 warm leads",
        type: "daily",
        priority: "High",
        completed: false,
      })
    } else {
      tasks.push({
        id: `daily-${date.toISOString()}-optimize`,
        text: "Optimize systems & processes",
        type: "daily",
        priority: "Medium",
        completed: false,
      })
    }

    // Weekly content creation (Tuesday, Thursday)
    if (dayOfWeek === 2 || dayOfWeek === 4) {
      tasks.push({
        id: `daily-${date.toISOString()}-content`,
        text: "Create valuable content",
        type: "daily",
        priority: "Medium",
        completed: false,
      })
    }

    return tasks
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getTaskTypeColor = (type: CalendarTask["type"]) => {
    switch (type) {
      case "mrr_checkpoint":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "goal_milestone":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "business_task":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "daily":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTaskIcon = (type: CalendarTask["type"]) => {
    switch (type) {
      case "mrr_checkpoint":
        return <DollarSign className="h-3 w-3" />
      case "goal_milestone":
        return <Target className="h-3 w-3" />
      case "business_task":
        return <TrendingUp className="h-3 w-3" />
      case "daily":
        return <Zap className="h-3 w-3" />
      default:
        return <Circle className="h-3 w-3" />
    }
  }

  const toggleTask = (dayIndex: number, taskId: string) => {
    const updatedDays = [...calendarDays]
    const task = updatedDays[dayIndex].tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
    }
    setCalendarDays(updatedDays)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Execution Calendar</h1>
          <p className="text-muted-foreground">Your 30-day action plan with MRR checkpoints</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Month/Year Display */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const completedTasks = day.tasks.filter((t) => t.completed).length
              const totalTasks = day.tasks.length
              const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    day.isCurrentMonth
                      ? day.isToday
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700"
                        : "bg-background hover:bg-muted/50"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  {/* Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${day.isToday ? "text-blue-600 font-bold" : ""}`}>
                      {day.date.getDate()}
                    </span>
                    {totalTasks > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {completedTasks}/{totalTasks}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {totalTasks > 0 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="space-y-1">
                    {day.tasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-1 p-1 rounded text-xs ${
                          task.completed ? "opacity-60 line-through" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTask(index, task.id)
                        }}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate flex-1">{task.text}</span>
                        {task.type === "mrr_checkpoint" && (
                          <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    {day.tasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">+{day.tasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedDay.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDay.tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No tasks scheduled for this day</p>
            ) : (
              <div className="space-y-3">
                {selectedDay.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      task.completed
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                        : "bg-background"
                    }`}
                  >
                    <button
                      onClick={() => {
                        const dayIndex = calendarDays.findIndex(
                          (d) => d.date.toDateString() === selectedDay.date.toDateString(),
                        )
                        if (dayIndex !== -1) {
                          toggleTask(dayIndex, task.id)
                          // Update selected day
                          setSelectedDay({
                            ...selectedDay,
                            tasks: selectedDay.tasks.map((t) =>
                              t.id === task.id ? { ...t, completed: !t.completed } : t,
                            ),
                          })
                        }
                      }}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.text}
                      </div>
                      {task.category && <div className="text-sm text-muted-foreground">{task.category}</div>}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getTaskTypeColor(task.type)}>
                        {getTaskIcon(task.type)}
                        <span className="ml-1 capitalize">{task.type.replace("_", " ")}</span>
                      </Badge>
                      {task.amount && <Badge variant="outline">${task.amount.toLocaleString()}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
