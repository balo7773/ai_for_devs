export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Poll {
  id: string
  title: string
  description: string
  category: string
  isActive: boolean
  totalVotes: number
  createdAt: string
  updatedAt: string
  endDate?: string
  createdBy: string
  options: PollOption[]
}

export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
  pollId: string
}

export interface Vote {
  id: string
  pollId: string
  optionId: string
  userId: string
  createdAt: string
}

export interface CreatePollData {
  title: string
  description: string
  category: string
  options: string[]
  endDate?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}
