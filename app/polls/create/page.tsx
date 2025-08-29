import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function CreatePollPage() {
  return (
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
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Poll Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter your poll question"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide additional context for your poll"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
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
                    <div className="flex gap-2">
                      <Input placeholder="Option 1" />
                      <Button type="button" variant="outline" size="sm">Remove</Button>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Option 2" />
                      <Button type="button" variant="outline" size="sm">Remove</Button>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Option 3" />
                      <Button type="button" variant="outline" size="sm">Remove</Button>
                    </div>
                    <Button type="button" variant="outline" className="w-full">
                      + Add Another Option
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input 
                    id="endDate" 
                    type="datetime-local"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Poll
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
  )
}
