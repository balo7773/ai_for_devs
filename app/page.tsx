import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to{" "}
          <span className="text-blue-600">AI_FOR_DEVS Polls</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create, share, and participate in polls with the developer community. 
          Get insights, make decisions, and engage with fellow developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/polls">
            <Button size="lg" className="text-lg px-8 py-3">
              Browse Polls
            </Button>
          </Link>
          <Link href="/polls/create">
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Create Poll
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardTitle>Easy Voting</CardTitle>
            <CardDescription>
              Simple and intuitive voting interface for quick participation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              See live results and statistics as votes come in
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <CardTitle>Community Driven</CardTitle>
            <CardDescription>
              Built for developers, by developers. Share your insights
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Polls Preview */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Polls</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What's your favorite programming language?</CardTitle>
              <CardDescription>156 votes • Technology</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/1">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Best pizza topping</CardTitle>
              <CardDescription>89 votes • Food</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/2">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Preferred work environment</CardTitle>
              <CardDescription>234 votes • Work</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/3">
                <Button variant="outline" className="w-full">View Results</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Link href="/polls">
          <Button variant="outline" size="lg">
            View All Polls
          </Button>
        </Link>
      </div>
    </div>
  )
}
