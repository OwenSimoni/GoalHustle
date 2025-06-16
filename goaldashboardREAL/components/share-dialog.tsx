"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2, Users, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ShareDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://your-app.com"
  const shareUrl = `${appUrl}?ref=invite`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  const sendInvite = () => {
    if (email.trim()) {
      // In a real app, this would send an email invitation
      toast({
        title: "Invite sent!",
        description: `Invitation sent to ${email}`,
      })
      setEmail("")
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Goal Tracker - Mission Control",
          text: "Check out this awesome goal tracking app!",
          url: shareUrl,
        })
      } catch (err) {
        copyToClipboard(shareUrl)
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Friends
          </DialogTitle>
          <DialogDescription>Share Goal Tracker with your friends and build success together!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Link */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button size="sm" onClick={() => copyToClipboard(shareUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={shareNative} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Invite */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Send Email Invite</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendInvite()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendInvite} disabled={!email.trim()}>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Share */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share on Social</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = "Check out this awesome goal tracking app!"
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
                      window.open(url, "_blank")
                    }}
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
                      window.open(url, "_blank")
                    }}
                  >
                    LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Features */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">What your friends get:</Label>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Goal tracking and progress monitoring</li>
                  <li>• Smart daily task generation</li>
                  <li>• Business model planning</li>
                  <li>• Habit tracking and streaks</li>
                  <li>• Performance insights and analytics</li>
                  <li>• Motivation and vision board</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
