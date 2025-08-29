import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock data for demonstration
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "A survey to understand developer preferences in 2024. This poll will help us understand which programming languages are most popular among developers.",
  totalVotes: 156,
  isActive: true,
  createdAt: "2024-01-15",
  category: "Technology",
  options: [
    { id: "1", text: "JavaScript/TypeScript", votes: 45, percentage: 28.8 },
    { id: "2", text: "Python", votes: 38, percentage: 24.4 },
    { id: "3", text: "Java", votes: 25, percentage: 16.0 },
    { id: "4", text: "C++", votes: 18, percentage: 11.5 },
    { id: "5", text: "Go", votes: 15, percentage: 9.6 },
    { id: "6", text: "Rust", votes: 15, percentage: 9.6 }
  ]
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="ghost" className="mb-4">
              ← Back to Polls
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
                  <CardDescription className="mt-2">{mockPoll.description}</CardDescription>
                </div>
                <Badge variant={mockPoll.isActive ? "default" : "secondary"}>
                  {mockPoll.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Category: {mockPoll.category}</span>
                  <span>{mockPoll.totalVotes} total votes</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Voting Options</h3>
                  {mockPoll.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-gray-600">
                          {option.votes} votes ({option.percentage}%)
                        </span>
                      </div>
                      <Progress value={option.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                
                {mockPoll.isActive && (
                  <div className="pt-4 border-t">
                    <Button className="w-full">Vote Now</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
