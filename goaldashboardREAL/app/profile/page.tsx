"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Trophy,
  TrendingUp,
  Users,
  Edit,
  Save,
  X,
  Crown,
  Flame,
  Award,
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio: string
  location: string
  businessModel: string
  website?: string
  monthlyRevenue: number
  totalEarned: number
  joinedAt: string
  verified: boolean
  rank: number
  streak: number
  groupsCount: number
  achievements: Achievement[]
  revenueHistory: RevenueEntry[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface RevenueEntry {
  month: string
  amount: number
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
    businessModel: "",
    website: "",
    monthlyRevenue: 0,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    // Demo data - in real app this would come from Supabase
    const demoProfile: UserProfile = {
      id: "current-user",
      name: "Alex Thompson",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=120&width=120",
      bio: "Serial entrepreneur building the future of digital marketing. Passionate about helping others scale their businesses through proven systems and strategies.",
      location: "Austin, TX",
      businessModel: "Digital Marketing Agency",
      website: "https://alexthompson.com",
      monthlyRevenue: 95000,
      totalEarned: 890000,
      joinedAt: "2024-01-15",
      verified: true,
      rank: 8,
      streak: 12,
      groupsCount: 3,
      achievements: [
        {
          id: "1",
          title: "First 50K",
          description: "Reached $50K monthly revenue",
          icon: "💰",
          unlockedAt: "2024-03-15",
          rarity: "rare",
        },
        {
          id: "2",
          title: "Community Builder",
          description: "Joined 3+ groups",
          icon: "👥",
          unlockedAt: "2024-04-01",
          rarity: "common",
        },
        {
          id: "3",
          title: "Streak Keeper",
          description: "Maintained 10+ day streak",
          icon: "🔥",
          unlockedAt: "2024-05-20",
          rarity: "rare",
        },
      ],
      revenueHistory: [
        { month: "Jan 2024", amount: 45000 },
        { month: "Feb 2024", amount: 52000 },
        { month: "Mar 2024", amount: 58000 },
        { month: "Apr 2024", amount: 67000 },
        { month: "May 2024", amount: 78000 },
        { month: "Jun 2024", amount: 95000 },
      ],
    }

    setProfile(demoProfile)
    setEditForm({
      name: demoProfile.name,
      bio: demoProfile.bio,
      location: demoProfile.location,
      businessModel: demoProfile.businessModel,
      website: demoProfile.website || "",
      monthlyRevenue: demoProfile.monthlyRevenue,
    })
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    if (profile) {
      setEditForm({
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        businessModel: profile.businessModel,
        website: profile.website || "",
        monthlyRevenue: profile.monthlyRevenue,
      })
    }
  }

  const saveProfile = () => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        ...editForm,
      }
      setProfile(updatedProfile)
      setIsEditing(false)
      // In real app, save to Supabase
    }
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

  const getGrowthRate = () => {
    if (!profile || profile.revenueHistory.length < 2) return 0
    const current = profile.revenueHistory[profile.revenueHistory.length - 1].amount
    const previous = profile.revenueHistory[profile.revenueHistory.length - 2].amount
    return ((current - previous) / previous) * 100
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your HustleHub presence</p>
        </div>
        {!isEditing ? (
          <Button onClick={startEditing}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={saveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={cancelEditing}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Full name"
                    />
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Bio"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-xl font-bold">{profile.name}</h2>
                      {profile.verified && (
                        <Badge className="bg-blue-600">
                          <Crown className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <Input
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <Input
                          value={editForm.businessModel}
                          onChange={(e) => setEditForm({ ...editForm, businessModel: e.target.value })}
                          placeholder="Business model"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <Input
                          type="number"
                          value={editForm.monthlyRevenue}
                          onChange={(e) => setEditForm({ ...editForm, monthlyRevenue: Number(e.target.value) })}
                          placeholder="Monthly revenue"
                        />
                      </div>
                      <Input
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        placeholder="Website (optional)"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{profile.businessModel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${(profile.monthlyRevenue / 1000).toFixed(0)}K/month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                      </div>
                      {profile.website && (
                        <div className="flex items-center gap-2">
                          <span>🌐</span>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Global Rank</span>
                </div>
                <span className="font-bold">#{profile.rank}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Current Streak</span>
                </div>
                <span className="font-bold">{profile.streak} days</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Groups</span>
                </div>
                <span className="font-bold">{profile.groupsCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Growth Rate</span>
                </div>
                <span className="font-bold text-green-600">+{getGrowthRate().toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Revenue Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${(profile.monthlyRevenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Current Monthly</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${(profile.totalEarned / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-muted-foreground">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">+{getGrowthRate().toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Monthly Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.achievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${getRarityColor(achievement.rarity)}`}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm opacity-90">{achievement.description}</p>
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.revenueHistory.map((entry, index) => {
                      const previousEntry = profile.revenueHistory[index - 1]
                      const growth = previousEntry
                        ? ((entry.amount - previousEntry.amount) / previousEntry.amount) * 100
                        : 0

                      return (
                        <div key={entry.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">{entry.month}</div>
                            {index > 0 && (
                              <div
                                className={`text-sm ${growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-muted-foreground"}`}
                              >
                                {growth > 0 ? "+" : ""}
                                {growth.toFixed(1)}% vs previous month
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">${(entry.amount / 1000).toFixed(0)}K</div>
                            <div className="text-sm text-muted-foreground">${entry.amount.toLocaleString()}</div>
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
                  <CardTitle>All Achievements</CardTitle>
                  <p className="text-muted-foreground">Your collection of unlocked achievements</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className={`p-4 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-bold text-lg">{achievement.title}</h4>
                            <p className="text-sm opacity-90">{achievement.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-white/20 border-white/30">
                            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                          </Badge>
                          <div className="text-sm opacity-75">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Updated monthly revenue to $95K</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Joined "Elite Entrepreneurs NYC" group</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Unlocked "Streak Keeper" achievement</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Completed weekly goal check-in</p>
                        <p className="text-xs text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
