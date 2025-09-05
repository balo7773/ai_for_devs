"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"
import Link from "next/link"

/**
 * Renders the page for creating a new poll.
 * This page is protected and requires user authentication.
 */
export default function CreatePollPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    endDate: ""
  })
  const [options, setOptions] = useState(["", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  /**
   * Handles changes to the main form inputs (title, description, end date).
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Handles changes to the category select input.
   * @param {string} value - The selected category value.
   */
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  /**
   * Updates the value of a specific poll option.
   * @param {number} index - The index of the option to update.
   * @param {string} value - The new text for the option.
   */
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  /**
   * Adds a new, empty option field to the form.
   */
  const addOption = () => {
    setOptions([...options, ""])
  }

  /**
   * Removes a poll option field from the form.
   * Ensures that at least two options always remain.
   * @param {number} index - The index of the option to remove.
   */
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  /**
   * Handles the form submission to create a new poll.
   * It validates the form, inserts the poll into the database,
   * and then inserts the associated options.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!user) {
      setError("You must be logged in to create a poll.")
      setIsLoading(false)
      return
    }

    // Validation
    if (!formData.title || !formData.category) {
      setError("Title and category are required")
      setIsLoading(false)
      return
    }

    const validOptions = options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      setError("At least 2 options are required")
      setIsLoading(false)
      return
    }

    try {
      const { createClient } = await import("@/lib/supabase")
      const supabase = createClient()

      // Step 1: Insert the main poll data into the 'polls' table.
      const { data: poll, error: pollError } = await supabase.from("polls").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        is_active: true,
        created_by: user.id,
        created_at: new Date().toISOString(),
      }).select().single()

      if (pollError || !poll) {
        setError("Failed to create poll. Please try again.")
        setIsLoading(false)
        return
      }

      // Step 2: Insert the poll options into the 'options' table, linking them to the new poll.
      const optionsToInsert = validOptions.map(option => ({
        poll_id: poll.id,
        text: option,
        votes: 0
      }))
      const { error: optionsError } = await supabase.from("options").insert(optionsToInsert)
      if (optionsError) {
        setError("Failed to create poll options. Please try again.")
        setIsLoading(false)
        return
      }

      // Show success message
      alert("Poll created successfully!")
      router.push("/polls")
    } catch (error) {
      setError("Failed to create poll. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/polls">
              <Button variant="ghost" className="mb-4">
                ← Back to Polls
              </Button>
            </Link>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create New Poll</CardTitle>
                <CardDescription>
                  Create a new poll to gather opinions from the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Poll Title</Label>
                    <Input 
                      id="title" 
                      name="title"
                      placeholder="Enter your poll question"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      placeholder="Provide additional context for your poll"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Poll Options</Label>
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                          {options.length > 2 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeOption(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={addOption}
                      >
                        + Add Another Option
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input 
                      id="endDate" 
                      name="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? "Creating Poll..." : "Create Poll"}
                    </Button>
                    <Link href="/polls">
                      <Button type="button" variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
