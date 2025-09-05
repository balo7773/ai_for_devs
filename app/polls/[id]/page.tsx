"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth/AuthProvider'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface Poll {
  id: string
  title: string
  description: string
  totalVotes: number
  isActive: boolean
  createdAt: string
  category: string
  options: PollOption[]
}

/**
 * Renders the detailed view for a single poll.
 * It fetches poll data, handles user voting, and displays results.
 */
export default function PollDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = typeof params.then === "function" ? React.use(params) : params;
  const id = resolvedParams.id;
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    /**
     * Fetches the poll data from Supabase, including its options.
     * It then calculates the total votes and the percentage for each option.
     */
    const fetchPoll = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('polls')
          .select(
            `
            id,
            title,
            description,
            is_active,
            created_at,
            category,
            options (id, text, votes)
          `
          )
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Define a type for the raw option data from Supabase for clarity.
          type RawOption = { id: string; text: string; votes: number };

          // Calculate the total number of votes across all options.
          const totalVotes = data.options.reduce(
            (sum: number, option: RawOption) => sum + option.votes,
            0
          );

          // Map over the options to add the calculated vote percentage.
          const optionsWithPercentage = data.options.map(
            (option: RawOption): PollOption => ({
              ...option,
              percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
            })
          );

          setPoll({
            id: data.id,
            title: data.title,
            description: data.description,
            totalVotes,
            isActive: data.is_active,
            createdAt: data.created_at,
            category: data.category,
            options: optionsWithPercentage,
          });
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
        toast({
          title: "Error",
          description: "Failed to load poll. Please try again.",
          variant: "destructive",
        });
        setPoll(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, supabase, toast]);

  /**
   * Handles the submission of a user's vote.
   * It checks for authentication and option selection before proceeding.
   * The function records the vote in the 'votes' table to prevent duplicates
   * and then increments the vote count on the 'options' table.
   * Note: The vote count increment is not atomic and could be improved with a database function (RPC).
   */
  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be signed in to vote.",
        variant: "destructive",
      })
      return
    }

    if (!selectedOption) {
      toast({
        title: "No Option Selected",
        description: "Please select an option before voting.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // Step 1: Insert a record into the 'votes' table to prevent the user from voting again.
    // A unique constraint on (poll_id, user_id) in the database schema is expected.
    const { error: voteError } = await supabase.from('votes').insert({
      poll_id: poll?.id,
      option_id: selectedOption,
      user_id: user.id,
    })

    // Step 2: Increment the vote count for the selected option.
    // WARNING: This is a read-modify-write operation and is not atomic.
    // In a high-concurrency scenario, this could lead to inaccurate vote counts.
    // A better approach is to use a Supabase RPC (database function) to increment the value atomically.
    const { error: optionError } = await supabase
      .from('options')
      .update({ votes: poll?.options.find(o => o.id === selectedOption)?.votes + 1 })
      .eq('id', selectedOption)

    if (voteError || optionError) {
      console.error('Error recording vote:', voteError || optionError)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully cast!",
      })
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading poll...</div>
  }

  if (!poll) {
    return <div className="container mx-auto px-4 py-8 text-center">Poll not found.</div>
  }

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
                  <CardTitle className="text-2xl">{poll.title}</CardTitle>
                  <CardDescription className="mt-2">{poll.description}</CardDescription>
                </div>
                <Badge variant={poll.isActive ? "default" : "secondary"}>
                  {poll.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Category: {poll.category}</span>
                  <span>{poll.totalVotes} total votes</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Voting Options</h3>
                  {poll.isActive && user ? (
                    <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ""}>
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    poll.options.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.text}</span>
                          <span className="text-sm text-gray-600">
                            {option.votes} votes ({option.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
                
                {poll.isActive && user && (
                  <div className="pt-4 border-t">
                    <Button onClick={handleVote} className="w-full" disabled={submitting || !selectedOption}>
                      {submitting ? "Submitting..." : "Vote Now"}
                    </Button>
                  </div>
                )}
                {!user && poll.isActive && (
                  <div className="pt-4 border-t text-center text-sm text-gray-500">
                    Please sign in to vote.
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
