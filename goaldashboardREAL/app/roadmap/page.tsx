"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CheckCircle, Circle, DollarSign, Target, TrendingUp, ChevronDown, ChevronRight, Zap } from "lucide-react"

interface RoadmapItem {
  id: string
  title: string
  amount: number
  date: Date
  type: "milestone" | "purchase" | "goal"
  description: string
  completed: boolean
  category: string
  actionPlan: string[]
  dailyActions: string[]
  weeklyGoals: string[]
}

interface VisionItem {
  id: string
  name: string
  cost: number
  monthlyIncome: number
  description: string
  lifestyleUnlocks: string[]
}

export default function Roadmap() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([])
  const [visionItems, setVisionItems] = useState<VisionItem[]>([])
  const [currentIncome, setCurrentIncome] = useState(0)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    generateRoadmap()
  }, [])

  const generateRoadmap = () => {
    const goals = JSON.parse(localStorage.getItem("user-goals") || "[]")
    const visionBoard = JSON.parse(localStorage.getItem("motivation-media") || "[]")

    const items: RoadmapItem[] = []
    let income = 0

    // Get current income from goals
    const incomeGoals = goals.filter((g: any) => g.category === "Income")
    if (incomeGoals.length > 0) {
      income = Math.max(...incomeGoals.map((g: any) => g.currentAmount))
      setCurrentIncome(income)
    }

    // Add goal milestones with detailed action plans
    goals.forEach((goal: any) => {
      const targetDate = new Date(goal.targetDate)
      const monthsToTarget = Math.max(1, Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))

      for (let i = 1; i <= 4; i++) {
        const milestoneAmount = goal.currentAmount + (goal.targetAmount - goal.currentAmount) * (i / 4)
        const milestoneDate = new Date(Date.now() + monthsToTarget * (i / 4) * 30 * 24 * 60 * 60 * 1000)

        // Generate specific action plans based on milestone amount
        const actionPlan = generateActionPlan(goal.category, milestoneAmount, goal.currentAmount)
        const dailyActions = generateDailyActions(goal.category, milestoneAmount)
        const weeklyGoals = generateWeeklyGoals(goal.category, milestoneAmount)

        items.push({
          id: `${goal.id}-milestone-${i}`,
          title: `${goal.name} - ${Math.round((i / 4) * 100)}% Complete`,
          amount: milestoneAmount,
          date: milestoneDate,
          type: "milestone",
          description: `Reach $${milestoneAmount.toLocaleString()} in ${goal.name}`,
          completed: goal.currentAmount >= milestoneAmount,
          category: goal.category,
          actionPlan,
          dailyActions,
          weeklyGoals,
        })
      }
    })

    // Add comprehensive lifestyle purchases with detailed unlock information
    const lifestylePurchases = [
      // 5K Level
      {
        name: "Nice 1BR Apartment",
        cost: 1500,
        monthlyIncome: 5000,
        description: "Comfortable living space in good area",
        lifestyleUnlocks: [
          "Live independently in a safe, comfortable area",
          "Have space for home office and productivity",
          "Build credit history through consistent rent payments",
          "Create content in a professional-looking space",
          "Host small gatherings and networking events",
        ],
      },
      {
        name: "Reliable Car (Honda Civic)",
        cost: 25000,
        monthlyIncome: 5000,
        description: "Dependable transportation",
        lifestyleUnlocks: [
          "Reliable transportation for business meetings",
          "Freedom to travel for opportunities",
          "Professional image for client meetings",
          "No more ride-share expenses",
          "Build credit through auto loan payments",
        ],
      },
      // 10K Level
      {
        name: "BMW 3 Series",
        cost: 45000,
        monthlyIncome: 10000,
        description: "Entry luxury vehicle",
        lifestyleUnlocks: [
          "Professional luxury image for high-end clients",
          "Advanced technology and comfort features",
          "Strong resale value and reliability",
          "Access to BMW events and community",
          "Enhanced personal brand and status",
        ],
      },
      {
        name: "Rolex Submariner",
        cost: 12000,
        monthlyIncome: 10000,
        description: "Classic luxury timepiece",
        lifestyleUnlocks: [
          "Signal success in business meetings",
          "Conversation starter with high-net-worth individuals",
          "Investment piece that holds/appreciates in value",
          "Daily reminder of your achievements",
          "Access to exclusive Rolex events and community",
        ],
      },
      {
        name: "Luxury 2BR Apartment",
        cost: 2500,
        monthlyIncome: 10000,
        description: "High-end living with amenities",
        lifestyleUnlocks: [
          "Impressive space for client entertainment",
          "Premium amenities (gym, pool, concierge)",
          "Professional address for business credibility",
          "Networking opportunities with successful neighbors",
          "Enhanced quality of life and productivity",
        ],
      },
      // 15K Level
      {
        name: "BMW M4 Competition",
        cost: 80000,
        monthlyIncome: 15000,
        description: "High-performance sports car",
        lifestyleUnlocks: [
          "Ultimate driving experience with 503hp",
          "Exclusive M car community and track events",
          "Strong statement piece for personal brand",
          "Weekend track days and car meets",
          "Impress high-value clients and partners",
        ],
      },
      {
        name: "Luxury Downtown Condo",
        cost: 4000,
        monthlyIncome: 15000,
        description: "Premium urban living",
        lifestyleUnlocks: [
          "Prime location for business networking",
          "Walking distance to high-end restaurants and venues",
          "Impressive space for entertaining clients",
          "Strong investment potential and equity building",
          "Access to exclusive building amenities and events",
        ],
      },
      {
        name: "Private Jet Shares (NetJets)",
        cost: 25000,
        monthlyIncome: 15000,
        description: "Fractional jet ownership",
        lifestyleUnlocks: [
          "Skip commercial airline hassles and delays",
          "Productive travel time for business",
          "Access to smaller airports closer to destinations",
          "Impress clients with private aviation",
          "Flexible scheduling for business opportunities",
        ],
      },
      // 25K Level
      {
        name: "Tesla Model S Plaid",
        cost: 120000,
        monthlyIncome: 25000,
        description: "Ultimate electric performance sedan",
        lifestyleUnlocks: [
          "Fastest production sedan (0-60 in 1.99s)",
          "Cutting-edge technology and autopilot",
          "Environmental consciousness with luxury",
          "Access to Tesla Supercharger network",
          "Tech-forward image for personal brand",
        ],
      },
      {
        name: "Luxury Home",
        cost: 8000,
        monthlyIncome: 25000,
        description: "Custom home or penthouse",
        lifestyleUnlocks: [
          "Host large business events and networking dinners",
          "Multiple home offices and creative spaces",
          "Build significant equity and generational wealth",
          "Impressive backdrop for video content creation",
          "Privacy and space for family and personal life",
        ],
      },
      {
        name: "Vacation Home",
        cost: 300000,
        monthlyIncome: 25000,
        description: "Beach house or mountain retreat",
        lifestyleUnlocks: [
          "Personal retreat for recharging and creativity",
          "Rental income potential when not in use",
          "Host exclusive business retreats and masterminds",
          "Create premium content from exotic locations",
          "Build real estate investment portfolio",
        ],
      },
      // 50K Level
      {
        name: "Luxury Yacht",
        cost: 500000,
        monthlyIncome: 50000,
        description: "Private yacht for entertaining",
        lifestyleUnlocks: [
          "Ultimate entertainment venue for high-net-worth clients",
          "Exclusive yacht club memberships and events",
          "Charter income potential when not in use",
          "Unique venue for business deals and partnerships",
          "Access to exclusive marinas and destinations",
        ],
      },
      {
        name: "Private Jet Ownership",
        cost: 2000000,
        monthlyIncome: 50000,
        description: "Own aircraft for ultimate flexibility",
        lifestyleUnlocks: [
          "Complete travel freedom and flexibility",
          "Ultimate time-saving for business efficiency",
          "Impressive asset for high-level business deals",
          "Charter income potential to offset costs",
          "Access to exclusive aviation events and communities",
        ],
      },
    ]

    lifestylePurchases.forEach((purchase) => {
      if (income < purchase.monthlyIncome) {
        // Calculate when this becomes affordable
        const incomeGrowthGoal = goals.find(
          (g: any) => g.category === "Income" && g.targetAmount >= purchase.monthlyIncome,
        )
        if (incomeGrowthGoal) {
          const targetDate = new Date(incomeGrowthGoal.targetDate)
          const actionPlan = generatePurchaseActionPlan(purchase.monthlyIncome, income)

          items.push({
            id: `purchase-${purchase.name.replace(/\s+/g, "-").toLowerCase()}`,
            title: `Unlock ${purchase.name}`,
            amount: purchase.monthlyIncome,
            date: targetDate,
            type: "purchase",
            description: `When you reach $${purchase.monthlyIncome.toLocaleString()}/month, you can comfortably afford ${purchase.name}`,
            completed: false,
            category: "Lifestyle",
            actionPlan,
            dailyActions: generateIncomeActions(purchase.monthlyIncome),
            weeklyGoals: generateIncomeWeeklyGoals(purchase.monthlyIncome),
          })
        }
      }
    })

    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime())
    setRoadmapItems(items)
    setVisionItems(lifestylePurchases)
  }

  const generateActionPlan = (category: string, targetAmount: number, currentAmount: number): string[] => {
    const gap = targetAmount - currentAmount
    const monthlyGap = gap / 12 // Assuming 12 months

    if (category === "Income") {
      if (monthlyGap > 5000) {
        return [
          "Launch premium consulting service ($3,000-5,000/client)",
          "Create high-ticket online course ($1,000-2,000)",
          "Secure 2-3 enterprise clients with retainer agreements",
          "Build strategic partnerships for revenue sharing",
          "Develop multiple income streams to reduce risk",
        ]
      } else if (monthlyGap > 2000) {
        return [
          "Scale current services with premium pricing",
          "Add 3-5 new clients per month at higher rates",
          "Create recurring revenue streams",
          "Optimize conversion funnel for better ROI",
          "Expand into adjacent markets or services",
        ]
      } else {
        return [
          "Increase rates for existing services by 20-30%",
          "Add 1-2 new clients per month",
          "Improve service delivery for client retention",
          "Ask for referrals from satisfied clients",
          "Create upsell opportunities for current clients",
        ]
      }
    }
    return ["Define specific action plan for this goal"]
  }

  const generateDailyActions = (category: string, targetAmount: number): string[] => {
    if (category === "Income") {
      if (targetAmount > 15000) {
        return [
          "Make 20 cold calls to enterprise prospects",
          "Send 15 personalized LinkedIn messages to C-level executives",
          "Create 1 piece of thought leadership content",
          "Follow up with 10 warm leads",
          "Research and identify 5 new high-value prospects",
        ]
      } else if (targetAmount > 8000) {
        return [
          "Make 15 cold calls to qualified prospects",
          "Send 10 personalized outreach messages",
          "Post 2 pieces of valuable content",
          "Follow up with 5 warm leads",
          "Engage with 20 potential clients on social media",
        ]
      } else {
        return [
          "Make 10 cold calls or send 10 emails",
          "Post 1 piece of valuable content",
          "Follow up with 3 warm leads",
          "Engage with 15 potential clients",
          "Work on one business development task",
        ]
      }
    }
    return ["Complete daily actions toward this goal"]
  }

  const generateWeeklyGoals = (category: string, targetAmount: number): string[] => {
    if (category === "Income") {
      if (targetAmount > 15000) {
        return [
          "Close 1 high-value deal ($3,000+)",
          "Book 5 discovery calls with qualified prospects",
          "Publish 1 case study or success story",
          "Attend 2 networking events or industry meetups",
          "Review and optimize sales process",
        ]
      } else if (targetAmount > 8000) {
        return [
          "Close 2-3 medium-value deals",
          "Book 8-10 discovery calls",
          "Create 1 piece of long-form content",
          "Attend 1 networking event",
          "Follow up with all prospects from previous week",
        ]
      } else {
        return [
          "Close 1-2 new clients",
          "Book 5 discovery calls",
          "Create weekly content calendar",
          "Network with 10 new people",
          "Review and improve service offerings",
        ]
      }
    }
    return ["Complete weekly milestones for this goal"]
  }

  const generatePurchaseActionPlan = (requiredIncome: number, currentIncome: number): string[] => {
    const gap = requiredIncome - currentIncome
    return [
      `Increase monthly income by $${gap.toLocaleString()}`,
      "Build emergency fund (6 months expenses)",
      "Maintain debt-to-income ratio below 30%",
      "Establish excellent credit score (750+)",
      "Create separate savings fund for this purchase",
    ]
  }

  const generateIncomeActions = (targetIncome: number): string[] => {
    if (targetIncome > 20000) {
      return [
        "Focus on enterprise sales and high-ticket services",
        "Build strategic partnerships and joint ventures",
        "Create scalable business systems",
        "Hire team members to increase capacity",
        "Develop multiple revenue streams",
      ]
    } else if (targetIncome > 15000) {
      return [
        "Target mid-market clients with higher budgets",
        "Increase service prices by 30-50%",
        "Create premium service tiers",
        "Build recurring revenue model",
        "Focus on client retention and upsells",
      ]
    } else {
      return [
        "Increase current service rates",
        "Add 2-3 new clients per month",
        "Improve service delivery efficiency",
        "Ask for referrals consistently",
        "Create additional service offerings",
      ]
    }
  }

  const generateIncomeWeeklyGoals = (targetIncome: number): string[] => {
    if (targetIncome > 20000) {
      return [
        "Close 1 enterprise deal or secure major partnership",
        "Book 3-5 high-value prospect meetings",
        "Create 1 piece of authority-building content",
        "Review and optimize business operations",
        "Plan next week's strategic initiatives",
      ]
    } else if (targetIncome > 15000) {
      return [
        "Close 1-2 high-value deals",
        "Book 5-8 qualified prospect calls",
        "Create premium content showcasing expertise",
        "Follow up with all active prospects",
        "Optimize pricing and service packages",
      ]
    } else {
      return [
        "Close 2-3 new clients",
        "Book 8-10 discovery calls",
        "Create valuable content for audience",
        "Network with potential clients",
        "Improve service delivery process",
      ]
    }
  }

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getItemIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />

    switch (type) {
      case "milestone":
        return <Target className="h-5 w-5 text-blue-600" />
      case "purchase":
        return <DollarSign className="h-5 w-5 text-purple-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "purchase":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeUntil = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Past due"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
    return `${Math.round(diffDays / 365)} years`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Success Roadmap
        </h1>
        <p className="text-muted-foreground">Timeline to achieve your goals and unlock your dream lifestyle</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">${currentIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Current Monthly Income</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {roadmapItems.filter((item) => item.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Milestones Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {roadmapItems.filter((item) => !item.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Goals Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Timeline & Action Plans</h2>
        <div className="space-y-4">
          {roadmapItems.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)

            return (
              <Card key={item.id} className={`relative ${item.completed ? "opacity-75" : ""}`}>
                <Collapsible>
                  <CollapsibleTrigger className="w-full" onClick={() => toggleExpanded(item.id)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getItemIcon(item.type, item.completed)}</div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="text-left">
                              <h3
                                className={`font-semibold flex items-center gap-2 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                              >
                                {item.title}
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                              <div className="text-sm text-muted-foreground">{formatDate(item.date)}</div>
                              <div className="text-xs text-muted-foreground">{getTimeUntil(item.date)}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-green-600">${item.amount.toLocaleString()}</div>
                            {item.type === "milestone" && (
                              <div className="text-sm text-muted-foreground">
                                {item.completed ? "✅ Completed" : "🎯 Target"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6">
                      <div className="ml-9 space-y-6 border-l-2 border-muted pl-6">
                        {/* Action Plan */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Strategic Action Plan
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {item.actionPlan.map((action, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Daily Actions */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            Daily Actions Required
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {item.dailyActions.map((action, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Weekly Goals */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Weekly Milestones
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {item.weeklyGoals.map((goal, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}

          {roadmapItems.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Roadmap Generated</h3>
                <p className="text-muted-foreground">
                  Set up your goals first to generate your personalized success roadmap
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lifestyle Unlocks */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Unlocks</CardTitle>
          <p className="text-muted-foreground">What you can afford and experience at different income levels</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visionItems.map((item) => {
              const canAfford = currentIncome >= item.monthlyIncome
              const progressToAfford = Math.min(100, (currentIncome / item.monthlyIncome) * 100)

              return (
                <Card key={item.name} className={`${canAfford ? "ring-2 ring-green-500" : ""}`}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      {canAfford && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>

                    <p className="text-sm text-muted-foreground">{item.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Required Income</span>
                        <span className="font-medium">${item.monthlyIncome.toLocaleString()}/mo</span>
                      </div>

                      {!canAfford && (
                        <>
                          <Progress value={progressToAfford} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            ${(item.monthlyIncome - currentIncome).toLocaleString()} more needed
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-lg font-bold text-purple-600">${item.cost.toLocaleString()}</div>

                    {/* Lifestyle Benefits */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">What This Unlocks:</h5>
                      <div className="space-y-1">
                        {item.lifestyleUnlocks.slice(0, 3).map((unlock, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{unlock}</span>
                          </div>
                        ))}
                        {item.lifestyleUnlocks.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{item.lifestyleUnlocks.length - 3} more benefits...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
