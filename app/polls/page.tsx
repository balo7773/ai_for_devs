import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "A survey to understand developer preferences",
    totalVotes: 156,
    isActive: true,
    createdAt: "2024-01-15",
    category: "Technology"
  },
  {
    id: "2",
    title: "Best pizza topping",
    description: "Settle the debate once and for all",
    totalVotes: 89,
    isActive: true,
    createdAt: "2024-01-14",
    category: "Food"
  },
  {
    id: "3",
    title: "Preferred work environment",
    description: "Remote, hybrid, or office?",
    totalVotes: 234,
    isActive: false,
    createdAt: "2024-01-10",
    category: "Work"
  }
]

export default function PollsPage() {
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                <Badge variant={poll.isActive ? "default" : "secondary"}>
                  {poll.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Category: {poll.category}</span>
                  <span>{poll.totalVotes} votes</span>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {poll.createdAt}
                </div>
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" className="w-full">
                    {poll.isActive ? "Vote Now" : "View Results"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
