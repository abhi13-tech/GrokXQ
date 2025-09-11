"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Loader2, BarChart3 } from "lucide-react"

export function UsageMetrics() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [usageData, setUsageData] = useState([])
  const [pieData, setPieData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsageData() {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch usage data from the database
        const { data: usageStats, error: usageError } = await supabase
          .from("usage_statistics")
          .select("*")
          .eq("user_id", user.id)
          .order("month", { ascending: true })

        if (usageError) throw usageError

        // Fetch distribution data
        const { data: distributionData, error: distributionError } = await supabase
          .from("usage_distribution")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (distributionError && distributionError.code !== "PGRST116") throw distributionError

        setUsageData(usageStats || [])

        // Format pie data
        if (distributionData) {
          setPieData([
            { name: "Prompt Generation", value: distributionData.prompt_gen_percent || 0, color: "#0088FE" },
            { name: "Code Generation", value: distributionData.code_gen_percent || 0, color: "#00C49F" },
            { name: "Code Review", value: distributionData.code_review_percent || 0, color: "#FFBB28" },
            { name: "Test Generation", value: distributionData.test_gen_percent || 0, color: "#FF8042" },
          ])
        } else {
          setPieData([])
        }
      } catch (error) {
        console.error("Error fetching usage data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsageData()
  }, [user])

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-primary/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Usage Analytics</CardTitle>
            <CardDescription>Track how you're using the platform over time</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (usageData.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 border-primary/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Usage Analytics</CardTitle>
            <CardDescription>Track how you're using the platform over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">No usage data available yet</p>
              <p className="text-sm text-muted-foreground mt-1">Use the platform more to see your usage analytics</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Usage Analytics</CardTitle>
          <CardDescription>Track how you're using the platform over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 17, 23, 0.8)",
                        borderColor: "#333",
                        borderRadius: "0.5rem",
                        boxShadow: "0 0 10px rgba(0, 243, 255, 0.3)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prompt_gen"
                      stroke="#0088FE"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#0088FE", strokeWidth: 2 }}
                      name="Prompt Generation"
                    />
                    <Line
                      type="monotone"
                      dataKey="code_gen"
                      stroke="#00C49F"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#00C49F", strokeWidth: 2 }}
                      name="Code Generation"
                    />
                    <Line
                      type="monotone"
                      dataKey="code_review"
                      stroke="#FFBB28"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#FFBB28", strokeWidth: 2 }}
                      name="Code Review"
                    />
                    <Line
                      type="monotone"
                      dataKey="testing"
                      stroke="#FF8042"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#FF8042", strokeWidth: 2 }}
                      name="Testing"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 17, 23, 0.8)",
                        borderColor: "#333",
                        borderRadius: "0.5rem",
                        boxShadow: "0 0 10px rgba(0, 243, 255, 0.3)",
                      }}
                    />
                    <Bar dataKey="prompt_gen" fill="#0088FE" name="Prompt Generation" />
                    <Bar dataKey="code_gen" fill="#00C49F" name="Code Generation" />
                    <Bar dataKey="code_review" fill="#FFBB28" name="Code Review" />
                    <Bar dataKey="testing" fill="#FF8042" name="Testing" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              {pieData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 17, 23, 0.8)",
                          borderColor: "#333",
                          borderRadius: "0.5rem",
                          boxShadow: "0 0 10px rgba(0, 243, 255, 0.3)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No distribution data available yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Analytics data last updated: {new Date().toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
