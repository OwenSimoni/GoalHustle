"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, X, ImageIcon } from "lucide-react"

interface Quote {
  id: string
  text: string
  author: string
}

interface VisionItem {
  id: string
  title: string
  description: string
  estimatedCost?: number
  requiredIncome?: number
}

export default function Motivation() {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "1",
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      id: "2",
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
  ])

  const [visionItems, setVisionItems] = useState<VisionItem[]>([
    {
      id: "1",
      title: "BMW M4 Competition",
      description: "High-performance sports car",
      estimatedCost: 80000,
      requiredIncome: 15000,
    },
    {
      id: "2",
      title: "Luxury Penthouse",
      description: "Downtown penthouse with city views",
      estimatedCost: 500000,
      requiredIncome: 25000,
    },
  ])

  const [newQuote, setNewQuote] = useState({ text: "", author: "" })
  const [newVisionItem, setNewVisionItem] = useState({
    title: "",
    description: "",
    estimatedCost: 0,
    requiredIncome: 0,
  })
  const [showAddQuote, setShowAddQuote] = useState(false)
  const [showAddVision, setShowAddVision] = useState(false)

  useEffect(() => {
    const savedQuotes = localStorage.getItem("motivation-quotes")
    const savedVision = localStorage.getItem("motivation-media")

    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes))
    }
    if (savedVision) {
      setVisionItems(JSON.parse(savedVision))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("motivation-quotes", JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    localStorage.setItem("motivation-media", JSON.stringify(visionItems))
  }, [visionItems])

  const addQuote = () => {
    if (newQuote.text.trim() && newQuote.author.trim()) {
      const quote: Quote = {
        id: Date.now().toString(),
        text: newQuote.text.trim(),
        author: newQuote.author.trim(),
      }
      setQuotes([...quotes, quote])
      setNewQuote({ text: "", author: "" })
      setShowAddQuote(false)
    }
  }

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter((q) => q.id !== id))
  }

  const addVisionItem = () => {
    if (newVisionItem.title.trim()) {
      const item: VisionItem = {
        id: Date.now().toString(),
        title: newVisionItem.title.trim(),
        description: newVisionItem.description.trim(),
        estimatedCost: newVisionItem.estimatedCost,
        requiredIncome: newVisionItem.requiredIncome,
      }
      setVisionItems([...visionItems, item])
      setNewVisionItem({ title: "", description: "", estimatedCost: 0, requiredIncome: 0 })
      setShowAddVision(false)
    }
  }

  const deleteVisionItem = (id: string) => {
    setVisionItems(visionItems.filter((item) => item.id !== id))
  }

  const getTodaysQuote = () => {
    if (quotes.length === 0) return null
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  const todaysQuote = getTodaysQuote()
  const currentIncome = 5000 // This would come from goals

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Motivation Center
        </h1>
        <p className="text-muted-foreground">Fuel your drive and visualize your success</p>
      </div>

      {/* Today's Quote */}
      {todaysQuote && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-4xl text-blue-600">"</div>
              <blockquote className="text-lg font-medium italic">"{todaysQuote.text}"</blockquote>
              <cite className="text-sm text-muted-foreground">— {todaysQuote.author}</cite>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inspirational Quotes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inspirational Quotes</CardTitle>
            <Button onClick={() => setShowAddQuote(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Quote
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddQuote && (
            <div className="p-4 border rounded-lg space-y-3">
              <Textarea
                placeholder="Enter inspirational quote..."
                value={newQuote.text}
                onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
              />
              <Input
                placeholder="Author name"
                value={newQuote.author}
                onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={addQuote} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Quote
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddQuote(false)
                    setNewQuote({ text: "", author: "" })
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="relative group">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="text-2xl text-muted-foreground">"</div>
                    <blockquote className="italic">"{quote.text}"</blockquote>
                    <cite className="text-sm text-muted-foreground">— {quote.author}</cite>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuote(quote.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vision Board */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vision Board</CardTitle>
            <Button onClick={() => setShowAddVision(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vision
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddVision && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Vision title"
                  value={newVisionItem.title}
                  onChange={(e) => setNewVisionItem({ ...newVisionItem, title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newVisionItem.description}
                  onChange={(e) => setNewVisionItem({ ...newVisionItem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Estimated cost ($)"
                  value={newVisionItem.estimatedCost}
                  onChange={(e) => setNewVisionItem({ ...newVisionItem, estimatedCost: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Required monthly income ($)"
                  value={newVisionItem.requiredIncome}
                  onChange={(e) => setNewVisionItem({ ...newVisionItem, requiredIncome: Number(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addVisionItem} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Add Vision
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddVision(false)
                    setNewVisionItem({ title: "", description: "", estimatedCost: 0, requiredIncome: 0 })
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionItems.map((item) => {
              const canAfford = item.requiredIncome ? currentIncome >= item.requiredIncome : false
              const progressToAfford = item.requiredIncome
                ? Math.min(100, (currentIncome / item.requiredIncome) * 100)
                : 100

              return (
                <Card key={item.id} className={`relative group ${canAfford ? "ring-2 ring-green-500" : ""}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.title}</h4>
                      {canAfford && <span className="text-green-600 text-sm">✅ Affordable!</span>}
                    </div>

                    <p className="text-sm text-muted-foreground">{item.description}</p>

                    {item.estimatedCost > 0 && (
                      <div className="text-lg font-bold text-green-600">${item.estimatedCost.toLocaleString()}</div>
                    )}

                    {item.requiredIncome && !canAfford && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Unlocks at ${item.requiredIncome.toLocaleString()}/month
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressToAfford}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${(item.requiredIncome - currentIncome).toLocaleString()} more needed
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVisionItem(item.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}

            {visionItems.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No vision items yet. Add your first vision to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{quotes.length}</div>
            <div className="text-sm text-muted-foreground">Inspirational Quotes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-pink-600">{visionItems.length}</div>
            <div className="text-sm text-muted-foreground">Vision Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {visionItems.filter((item) => item.requiredIncome && currentIncome >= item.requiredIncome).length}
            </div>
            <div className="text-sm text-muted-foreground">Affordable Now</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
