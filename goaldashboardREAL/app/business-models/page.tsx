"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Check, X, DollarSign, Briefcase, Edit2, Save } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
}

interface BusinessModel {
  id: string
  name: string
  incomeModel: string
  status: "Not Started" | "In Progress" | "Systemized"
  description: string
  tasks: Task[]
  type: string
}

export default function BusinessModels() {
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([
    {
      id: "1",
      name: "Content Creation & Personal Brand",
      incomeModel: "$500/video + $2000/month sponsorships",
      status: "In Progress",
      description: "YouTube, TikTok, Instagram content with brand partnerships",
      type: "Content Creator",
      tasks: [
        { id: "1", text: "Create 3 pieces of content daily", completed: false },
        { id: "2", text: "Reach out to 5 brands for partnerships", completed: false },
        { id: "3", text: "Analyze top performing content", completed: false },
      ],
    },
    {
      id: "2",
      name: "High-Ticket Consulting",
      incomeModel: "$5000/client/month",
      status: "Not Started",
      description: "Business strategy consulting for entrepreneurs",
      type: "Consulting",
      tasks: [
        { id: "4", text: "Create premium service packages", completed: false },
        { id: "5", text: "Build authority through content", completed: false },
        { id: "6", text: "Network with high-value prospects", completed: false },
      ],
    },
  ])

  const [newTask, setNewTask] = useState("")
  const [addingTaskTo, setAddingTaskTo] = useState<string | null>(null)
  const [editingModel, setEditingModel] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    name: "",
    incomeModel: "",
    description: "",
    type: "",
  })

  const businessModelTypes = [
    "Content Creator",
    "Consulting",
    "Coaching",
    "Agency",
    "SaaS/Software",
    "E-commerce",
    "Real Estate",
    "Trading/Investing",
    "Affiliate Marketing",
    "Dropshipping",
    "Other",
  ]

  useEffect(() => {
    const saved = localStorage.getItem("business-models")
    if (saved) {
      setBusinessModels(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("business-models", JSON.stringify(businessModels))
  }, [businessModels])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Systemized":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleTask = (modelId: string, taskId: string) => {
    setBusinessModels((models) =>
      models.map((model) =>
        model.id === modelId
          ? {
              ...model,
              tasks: model.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
            }
          : model,
      ),
    )
  }

  const addTask = (modelId: string) => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
      }

      setBusinessModels((models) =>
        models.map((model) => (model.id === modelId ? { ...model, tasks: [...model.tasks, task] } : model)),
      )

      setNewTask("")
      setAddingTaskTo(null)
    }
  }

  const deleteTask = (modelId: string, taskId: string) => {
    setBusinessModels((models) =>
      models.map((model) =>
        model.id === modelId ? { ...model, tasks: model.tasks.filter((task) => task.id !== taskId) } : model,
      ),
    )
  }

  const updateModelStatus = (modelId: string, status: BusinessModel["status"]) => {
    setBusinessModels((models) => models.map((model) => (model.id === modelId ? { ...model, status } : model)))
  }

  const startEditingModel = (model: BusinessModel) => {
    setEditingModel(model.id)
    setEditValues({
      name: model.name,
      incomeModel: model.incomeModel,
      description: model.description,
      type: model.type,
    })
  }

  const saveModelEdits = (modelId: string) => {
    setBusinessModels((models) =>
      models.map((model) =>
        model.id === modelId
          ? {
              ...model,
              name: editValues.name,
              incomeModel: editValues.incomeModel,
              description: editValues.description,
              type: editValues.type,
            }
          : model,
      ),
    )
    setEditingModel(null)
  }

  const cancelEditingModel = () => {
    setEditingModel(null)
    setEditValues({ name: "", incomeModel: "", description: "", type: "" })
  }

  const addNewModel = () => {
    const newModel: BusinessModel = {
      id: Date.now().toString(),
      name: "New Business Model",
      incomeModel: "$0/month",
      status: "Not Started",
      description: "Describe your business model here...",
      type: "Other",
      tasks: [],
    }
    setBusinessModels([...businessModels, newModel])
  }

  const deleteModel = (modelId: string) => {
    setBusinessModels(businessModels.filter((model) => model.id !== modelId))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Models</h1>
          <p className="text-muted-foreground">Customize your revenue streams and execution plans</p>
        </div>
        <Button onClick={addNewModel} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Model
        </Button>
      </div>

      {/* Business Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessModels.map((model) => (
          <Card key={model.id} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {editingModel === model.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        className="font-semibold"
                      />
                      <Input
                        value={editValues.incomeModel}
                        onChange={(e) => setEditValues({ ...editValues, incomeModel: e.target.value })}
                        placeholder="e.g., $5000/client/month"
                      />
                      <Select
                        value={editValues.type}
                        onValueChange={(value) => setEditValues({ ...editValues, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {businessModelTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                        placeholder="Describe your business model..."
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveModelEdits(model.id)}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditingModel}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg leading-tight">{model.name}</CardTitle>
                      <div className="flex items-center gap-1 text-green-600 font-semibold mt-1">
                        <DollarSign className="h-4 w-4" />
                        {model.incomeModel}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{model.type}</div>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  {editingModel !== model.id && (
                    <Button variant="ghost" size="sm" onClick={() => startEditingModel(model)} className="h-6 w-6 p-0">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteModel(model.id)}
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {editingModel !== model.id && <p className="text-sm text-muted-foreground">{model.description}</p>}

              {/* Status Update */}
              <Select
                value={model.status}
                onValueChange={(value) => updateModelStatus(model.id, value as BusinessModel["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Systemized">Systemized</SelectItem>
                </SelectContent>
              </Select>

              {/* Tasks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Daily Tasks</h4>
                  <span className="text-xs text-muted-foreground">
                    {model.tasks.filter((t) => t.completed).length}/{model.tasks.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {model.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(model.id, task.id)}
                        className="h-3 w-3 rounded"
                      />
                      <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(model.id, task.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Task */}
                {addingTaskTo === model.id ? (
                  <div className="flex gap-1">
                    <Input
                      placeholder="New task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTask(model.id)}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={() => addTask(model.id)} className="h-8 px-2">
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAddingTaskTo(null)
                        setNewTask("")
                      }}
                      className="h-8 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingTaskTo(model.id)}
                    className="w-full h-8 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Task
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {businessModels.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Business Models</h3>
              <p className="text-muted-foreground mb-4">Add your first business model to get started</p>
              <Button onClick={addNewModel}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Model
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Business Model Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <p className="text-muted-foreground">Common business model templates to get you started</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Content Creator",
                income: "$1000-10000/month",
                description: "YouTube, TikTok, Instagram monetization",
                tasks: ["Create daily content", "Engage with audience", "Reach out to brands"],
              },
              {
                name: "High-Ticket Consulting",
                income: "$5000-15000/client",
                description: "Premium business consulting services",
                tasks: ["Conduct discovery calls", "Create case studies", "Network with prospects"],
              },
              {
                name: "Digital Agency",
                income: "$2000-10000/client/month",
                description: "Marketing services for businesses",
                tasks: ["Deliver client results", "Pitch new clients", "Create case studies"],
              },
              {
                name: "E-commerce Store",
                income: "20-40% profit margins",
                description: "Selling physical products online",
                tasks: ["Optimize product listings", "Scale winning products", "Test new variations"],
              },
              {
                name: "SaaS/Software",
                income: "$50-500/user/month",
                description: "Recurring software subscriptions",
                tasks: ["Improve user onboarding", "Reduce churn", "Conduct user interviews"],
              },
              {
                name: "Online Coaching",
                income: "$500-5000/student",
                description: "Teaching and coaching programs",
                tasks: ["Create course content", "Engage with students", "Get testimonials"],
              },
            ].map((template, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">{template.name}</h4>
                <div className="text-sm text-green-600 font-medium">{template.income}</div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="space-y-1">
                  {template.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="text-xs text-muted-foreground">
                      • {task}
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const newModel: BusinessModel = {
                      id: Date.now().toString(),
                      name: template.name,
                      incomeModel: template.income,
                      status: "Not Started",
                      description: template.description,
                      type: template.name,
                      tasks: template.tasks.map((task, i) => ({
                        id: `${Date.now()}-${i}`,
                        text: task,
                        completed: false,
                      })),
                    }
                    setBusinessModels([...businessModels, newModel])
                  }}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {businessModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {businessModels.filter((m) => m.status === "Systemized").length}
              </div>
              <div className="text-sm text-muted-foreground">Systemized</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {businessModels.filter((m) => m.status === "In Progress").length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {businessModels.reduce((acc, model) => acc + model.tasks.filter((t) => t.completed).length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
