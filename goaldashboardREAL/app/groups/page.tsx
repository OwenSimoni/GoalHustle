"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  MessageCircle,
  Trophy,
  Target,
  Plane,
  Zap,
  Crown,
} from "lucide-react"

interface Circle {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  location: string
  category: string
  isPrivate: boolean
  monthlyFee: number
  createdBy: string
  members: Member[]
}

interface Member {
  id: string
  name: string
  avatar?: string
  revenue: number
  location: string
  role: "owner" | "member"
}

export default function Groups() {
  const [userCircle, setUserCircle] = useState<Circle | null>(null)
  const [availableCircles, setAvailableCircles] = useState<Circle[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [newCircle, setNewCircle] = useState({
    name: "",
    description: "",
    location: "",
    category: "General",
    isPrivate: false,
    maxMembers: 10,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Check if user is in a circle
    const savedCircle = localStorage.getItem("user-circle")
    if (savedCircle) {
      setUserCircle(JSON.parse(savedCircle))
    }

    // Load available circles
    const demoCircles: Circle[] = [
      {
        id: "1",
        name: "NYC Entrepreneurs",
        description: "High-performing entrepreneurs in New York City pushing 6-figure goals",
        memberCount: 8,
        maxMembers: 10,
        location: "New York, NY",
        category: "Location-based",
        isPrivate: false,
        monthlyFee: 0, // Free for demo
        createdBy: "sarah-chen",
        members: [
          {
            id: "1",
            name: "Sarah Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            revenue: 125000,
            location: "NYC",
            role: "owner",
          },
          {
            id: "2",
            name: "Marcus Johnson",
            revenue: 95000,
            location: "NYC",
            role: "member",
          },
        ],
      },
      {
        id: "2",
        name: "SaaS Founders",
        description: "Software entrepreneurs building scalable businesses",
        memberCount: 6,
        maxMembers: 8,
        location: "Remote",
        category: "Industry",
        isPrivate: true,
        monthlyFee: 0, // Free for demo
        createdBy: "alex-kim",
        members: [],
      },
      {
        id: "3",
        name: "Content Creators",
        description: "Building audiences and monetizing content across platforms",
        memberCount: 12,
        maxMembers: 15,
        location: "Global",
        category: "Industry",
        isPrivate: false,
        monthlyFee: 0, // Free for demo
        createdBy: "emma-davis",
        members: [],
      },
    ]

    setAvailableCircles(demoCircles)
  }

  const createCircle = () => {
    if (newCircle.name && newCircle.description) {
      const circle: Circle = {
        id: Date.now().toString(),
        ...newCircle,
        memberCount: 1,
        createdBy: "current-user",
        members: [
          {
            id: "current-user",
            name: "You",
            revenue: 95000,
            location: newCircle.location,
            role: "owner",
          },
        ],
      }

      setUserCircle(circle)
      localStorage.setItem("user-circle", JSON.stringify(circle))
      setShowCreateForm(false)
      setNewCircle({
        name: "",
        description: "",
        location: "",
        category: "General",
        isPrivate: false,
        maxMembers: 10,
      })
    }
  }

  const joinCircle = (circle: Circle) => {
    const updatedCircle = {
      ...circle,
      memberCount: circle.memberCount + 1,
      members: [
        ...circle.members,
        {
          id: "current-user",
          name: "You",
          revenue: 95000,
          location: "Your Location",
          role: "member" as const,
        },
      ],
    }

    setUserCircle(updatedCircle)
    localStorage.setItem("user-circle", JSON.stringify(updatedCircle))
  }

  const leaveCircle = () => {
    setUserCircle(null)
    localStorage.removeItem("user-circle")
  }

  // If user is in a circle, show circle management interface
  if (userCircle) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {userCircle.name}
            </h1>
            <p className="text-muted-foreground">{userCircle.description}</p>
          </div>
          <Button variant="outline" onClick={leaveCircle}>
            Leave Circle
          </Button>
        </div>

        {/* Circle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{userCircle.memberCount}</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                ${Math.round(userCircle.members.reduce((sum, m) => sum + m.revenue, 0) / 1000)}K
              </div>
              <div className="text-sm text-muted-foreground">Total MRR</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{userCircle.location}</div>
              <div className="text-sm text-muted-foreground">Location</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">Weekly</div>
              <div className="text-sm text-muted-foreground">Check-ins</div>
            </CardContent>
          </Card>
        </div>

        {/* Circle Features */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="motivation">Motivation</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Circle Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">Sarah updated her monthly revenue</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">Marcus shared a weekly win</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">New group goal created</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Upcoming Events</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="font-medium">Weekly Check-in</div>
                        <div className="text-sm text-muted-foreground">Tomorrow at 7:00 PM</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="font-medium">Goal Review Session</div>
                        <div className="text-sm text-muted-foreground">Friday at 6:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Circle Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userCircle.members
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                  ? "bg-orange-600 text-white"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            {member.role === "owner" && <Crown className="h-4 w-4 text-yellow-600" />}
                          </div>
                          <div className="text-sm text-muted-foreground">{member.location}</div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-green-600">${(member.revenue / 1000).toFixed(0)}K/mo</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Circle Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Chat Coming Soon</h3>
                  <p>Real-time messaging with your circle members</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Circle Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Meetings Coming Soon</h3>
                  <p>Schedule and manage group video calls</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Group Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Group Goals Coming Soon</h3>
                  <p>Collaborative goal setting and tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-orange-600" />
                  Circle Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Trips Coming Soon</h3>
                  <p>Exclusive retreats and experiences for high performers</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="motivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Circle Motivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Motivation Coming Soon</h3>
                  <p>Daily motivation and accountability features</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // If user is not in a circle, show join/create interface
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Join a Circle
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect with like-minded entrepreneurs and achieve more together
        </p>
      </div>

      {/* Create or Join Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Circle */}
        <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Create Your Circle</h3>
                <p className="text-muted-foreground">Start your own entrepreneurial community</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">$5/month</span> <span className="font-bold text-green-600">FREE</span>{" "}
                  during beta
                </div>
                <div className="text-xs text-muted-foreground">Up to 10 members</div>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="w-full">
                Create Circle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Join with Code */}
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Join with Code</h3>
                <p className="text-muted-foreground">Have an invite code? Join instantly</p>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Enter invite code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <Button variant="outline" className="w-full" disabled={!joinCode.trim()}>
                  Join Circle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Circle Form */}
      {showCreateForm && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Create Your Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Circle Name</label>
                <Input
                  placeholder="e.g., Austin Entrepreneurs"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle({ ...newCircle, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g., Austin, TX"
                  value={newCircle.location}
                  onChange={(e) => setNewCircle({ ...newCircle, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Describe your circle's focus and goals..."
                value={newCircle.description}
                onChange={(e) => setNewCircle({ ...newCircle, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCircle}>Create Circle</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Circles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Circles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCircles.map((circle) => (
            <Card key={circle.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{circle.name}</h3>
                      {circle.isPrivate && <Badge variant="outline">Private</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{circle.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {circle.memberCount}/{circle.maxMembers} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{circle.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        <span className="line-through">${circle.monthlyFee}/month</span>{" "}
                        <span className="font-bold text-green-600">FREE</span>
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => joinCircle(circle)}
                    className="w-full"
                    disabled={circle.memberCount >= circle.maxMembers}
                  >
                    {circle.memberCount >= circle.maxMembers ? "Full" : "Join Circle"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
