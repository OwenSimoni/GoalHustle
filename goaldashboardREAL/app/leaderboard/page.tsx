"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Crown, Star, Flame, Target, Award, DollarSign, Users } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  revenue: number
  lastMonthRevenue: number
  location: string
  businessModel: string
  weeklyWins: number
  streak: number
  groupsCount: number
  rank: number
  previousRank: number
  totalEarned: number
  joinedAt: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedBy: string[]
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly" | "all-time">("monthly")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    loadLeaderboard()
    loadAchievements()
  }, [timeframe])

  const loadLeaderboard = () => {
    // Demo data - in real app this would come from Supabase
    const demoData: LeaderboardEntry[] = [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        revenue: 185000,
        lastMonthRevenue: 165000,
        location: "San Francisco, CA",
        businessModel: "SaaS",
        weeklyWins: 5,
        streak: 12,
        groupsCount: 3,
        rank: 1,
        previousRank: 2,
        totalEarned: 2100000,
        joinedAt: "2023-08-15",
      },
      {
        id: "2",
        name: "Marcus Johnson",
        revenue: 165000,
        lastMonthRevenue: 155000,
        location: "Austin, TX",
        businessModel: "E-commerce",
        weeklyWins: 4,
        streak: 8,
        groupsCount: 2,
        rank: 2,
        previousRank: 1,
        totalEarned: 1850000,
        joinedAt: "2023-07-20",
      },
      {
        id: "3",
        name: "Elena Rodriguez",
        revenue: 145000,
        lastMonthRevenue: 125000,
        location: "Miami, FL",
        businessModel: "Agency",
        weeklyWins: 6,
        streak: 15,
        groupsCount: 4,
        rank: 3,
        previousRank: 4,
        totalEarned: 1650000,
        joinedAt: "2023-09-10",
      },
      {
        id: "4",
        name: "David Kim",
        revenue: 135000,
        lastMonthRevenue: 140000,
        location: "Seattle, WA",
        businessModel: "Consulting",
        weeklyWins: 3,
        streak: 5,
        groupsCount: 2,
        rank: 4,
        previousRank: 3,
        totalEarned: 1420000,
        joinedAt: "2023-06-05",
      },
      {
        id: "5",
        name: "You",
        revenue: 95000,
        lastMonthRevenue: 85000,
        location: "New York, NY",
        businessModel: "Content Creator",
        weeklyWins: 4,
        streak: 7,
        groupsCount: 2,
        rank: 8,
        previousRank: 9,
        totalEarned: 890000,
        joinedAt: "2024-01-15",
      },
    ]

    setLeaderboard(demoData)
    setUserRank(demoData.find((entry) => entry.name === "You") || null)
  }

  const loadAchievements = () => {
    const demoAchievements: Achievement[] = [
      {
        id: "1",
        title: "First 100K",
        description: "Reached $100K monthly revenue",
        icon: "💰",
        rarity: "rare",
        unlockedBy: ["1", "2", "3", "4", "5"],
      },
      {
        id: "2",
        title: "Streak Master",
        description: "Maintained 30-day reporting streak",
        icon: "🔥",
        rarity: "epic",
        unlockedBy: ["1", "3"],
      },
      {
        id: "3",
        title: "Community Leader",
        description: "Led 3+ groups simultaneously",
        icon: "👑",
        rarity: "legendary",
        unlockedBy: ["3"],
      },
      {
        id: "4",
        title: "Growth Hacker",
        description: "50%+ month-over-month growth",
        icon: "🚀",
        rarity: "epic",
        unlockedBy: ["3"],
      },
    ]
    setAchievements(demoAchievements)
  }

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current
    if (change > 0) return { direction: "up", value: change }
    if (change < 0) return { direction: "down", value: Math.abs(change) }
    return { direction: "same", value: 0 }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTopPerformers = () => {
    return leaderboard.slice(0, 3)
  }

  const getRisingStars = () => {
    return leaderboard
      .filter((entry) => {
        const growth = ((entry.revenue - entry.lastMonthRevenue) / entry.lastMonthRevenue) * 100
        return growth > 20
      })
      .sort((a, b) => {
        const aGrowth = ((a.revenue - a.lastMonthRevenue) / a.lastMonthRevenue) * 100
        const bGrowth = ((b.revenue - b.lastMonthRevenue) / b.lastMonthRevenue) * 100
        return bGrowth - aGrowth
      })
      .slice(0, 5)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Elite Leaderboard
        </h1>
        <p className="text-muted-foreground">Compete with the best entrepreneurs worldwide</p>
      </div>

      {/* Your Rank Card */}
      {userRank && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold">#{userRank.rank}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Current Rank</h3>
                  <p className="text-blue-100">${(userRank.revenue / 1000).toFixed(0)}K monthly revenue</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRankChange(userRank.rank, userRank.previousRank).direction === "up" && (
                      <div className="flex items-center gap-1 text-green-300">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{getRankChange(userRank.rank, userRank.previousRank).value}</span>
                      </div>
                    )}
                    {getRankChange(userRank.rank, userRank.previousRank).direction === "down" && (
                      <div className="flex items-center gap-1 text-red-300">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">-{getRankChange(userRank.rank, userRank.previousRank).value}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-blue-200">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm">{userRank.streak} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200">Next Rank</div>
                <div className="text-lg font-bold">
                  ${((leaderboard[userRank.rank - 2]?.revenue || userRank.revenue + 10000) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-blue-200">
                  $
                  {(
                    ((leaderboard[userRank.rank - 2]?.revenue || userRank.revenue + 10000) - userRank.revenue) /
                    1000
                  ).toFixed(0)}
                  K to go
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overall" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="rising">Rising Stars</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          {/* Top 3 Podium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getTopPerformers().map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`relative p-6 rounded-lg text-center ${
                      index === 0
                        ? "bg-gradient-to-b from-yellow-400 to-yellow-600 text-white"
                        : index === 1
                          ? "bg-gradient-to-b from-gray-300 to-gray-500 text-white"
                          : "bg-gradient-to-b from-orange-400 to-orange-600 text-white"
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-white">
                      <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="font-bold text-lg">{entry.name}</h3>
                    <p className="text-sm opacity-90">{entry.businessModel}</p>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">${(entry.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-sm opacity-75">monthly revenue</div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                      <Flame className="h-4 w-4" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => {
                  const rankChange = getRankChange(entry.rank, entry.previousRank)
                  const growth = ((entry.revenue - entry.lastMonthRevenue) / entry.lastMonthRevenue) * 100

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                        entry.name === "You"
                          ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            entry.rank <= 3
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {entry.rank}
                        </div>

                        <Avatar className="w-12 h-12">
                          <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.name}</span>
                          {entry.rank === 1 && <Crown className="h-4 w-4 text-yellow-600" />}
                          {entry.name === "You" && <Badge variant="outline">You</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.businessModel} • {entry.location}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Flame className="h-3 w-3" />
                            <span>{entry.streak} days</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3" />
                            <span>{entry.groupsCount} groups</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            <span>{entry.weeklyWins} wins</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">${(entry.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">
                          {growth > 0 ? "+" : ""}
                          {growth.toFixed(1)}% vs last month
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {rankChange.direction === "up" && (
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              <span className="text-xs">+{rankChange.value}</span>
                            </div>
                          )}
                          {rankChange.direction === "down" && (
                            <div className="flex items-center gap-1 text-red-600">
                              <TrendingDown className="h-3 w-3" />
                              <span className="text-xs">-{rankChange.value}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rising" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Rising Stars
              </CardTitle>
              <p className="text-muted-foreground">Entrepreneurs with the highest growth rates</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRisingStars().map((entry, index) => {
                  const growth = ((entry.revenue - entry.lastMonthRevenue) / entry.lastMonthRevenue) * 100

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      <Avatar>
                        <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {entry.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">{entry.businessModel}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">+{growth.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          ${(entry.revenue / 1000).toFixed(0)}K current
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Community Achievements
              </CardTitle>
              <p className="text-muted-foreground">Rare accomplishments unlocked by elite members</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-bold">{achievement.title}</h4>
                        <p className="text-sm opacity-90">{achievement.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-white/20 border-white/30">
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </Badge>
                      <div className="text-sm opacity-75">{achievement.unlockedBy.length} members</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">$12.5M</div>
                <div className="text-sm text-muted-foreground">Total Community Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">247</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">34%</div>
                <div className="text-sm text-muted-foreground">Avg Monthly Growth</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">Goal Achievement Rate</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Community Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Top Business Models</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>SaaS</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />

                    <div className="flex justify-between">
                      <span>E-commerce</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />

                    <div className="flex justify-between">
                      <span>Agency</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <Progress value={24} className="h-2" />

                    <div className="flex justify-between">
                      <span>Consulting</span>
                      <span className="font-medium">16%</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>San Francisco</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />

                    <div className="flex justify-between">
                      <span>New York</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />

                    <div className="flex justify-between">
                      <span>Austin</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />

                    <div className="flex justify-between">
                      <span>Miami</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
