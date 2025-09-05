"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

/**
 * Renders the page that displays a list of all available polls.
 */
export default function PollsPage() {
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * Fetches all polls from the Supabase 'polls' table
     * when the component mounts.
     */
    const supabase = createClient()
    supabase
      .from("polls")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          setPolls([])
        } else {
          setPolls(data || [])
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
          <p className="text-gray-600 mt-2">Discover and participate in community polls</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading polls...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <Badge variant={poll.is_active ? "default" : "secondary"}>
                    {poll.is_active ? "Active" : "Closed"}
                  </Badge>
                </div>
                <CardDescription>{poll.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Category: {poll.category}</span>
                    {/* You can fetch totalVotes from options if needed */}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {poll.created_at}
                  </div>
                  <Link href={`/polls/${poll.id}`}>
                    <Button variant="outline" className="w-full">
                      {poll.is_active ? "Vote Now" : "View Results"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
