"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"

export function UserSettings() {
  const { toast } = useToast()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)

  // Use actual user data where available, fallback to defaults
  const [userSettings, setUserSettings] = useState({
    name: profile?.full_name || "User",
    email: user?.email || "",
    codeStyle: "standard",
    defaultModel: "gpt-4",
    theme: "system",
  })

  const handleSaveProfile = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">User Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                    className="border-primary/20 bg-background/50 focus:border-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                    className="border-primary/20 bg-background/50 focus:border-primary"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Your email address cannot be changed</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code-style">Default Code Style</Label>
                  <Select
                    value={userSettings.codeStyle}
                    onValueChange={(value) => setUserSettings({ ...userSettings, codeStyle: value })}
                  >
                    <SelectTrigger id="code-style">
                      <SelectValue placeholder="Select a code style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="google">Google Style</SelectItem>
                      <SelectItem value="airbnb">Airbnb Style</SelectItem>
                      <SelectItem value="microsoft">Microsoft Style</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="default-model">Default AI Model</Label>
                  <Select
                    value={userSettings.defaultModel}
                    onValueChange={(value) => setUserSettings({ ...userSettings, defaultModel: value })}
                  >
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="groq-mixtral">Groq Mixtral</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                      <SelectItem value="grok">Grok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <Select
                    value={userSettings.theme}
                    onValueChange={(value) => setUserSettings({ ...userSettings, theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="border-primary/20 bg-background/50 focus:border-primary pr-20"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-1 top-1"
                      onClick={() => {
                        toast({
                          title: "API key copied",
                          description: "Your API key has been copied to the clipboard.",
                        })
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this key to access the GrokXQ API</p>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" className="w-full">
                    Regenerate API Key
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
