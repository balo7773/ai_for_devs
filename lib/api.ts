import { Poll, CreatePollData, LoginData, RegisterData, User } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<{ user: User; token: string }> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  logout: async (): Promise<void> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest('/auth/me')
  },
}

// Polls API
export const pollsApi = {
  getAll: async (): Promise<Poll[]> => {
    return apiRequest('/polls')
  },

  getById: async (id: string): Promise<Poll> => {
    return apiRequest(`/polls/${id}`)
  },

  create: async (data: CreatePollData): Promise<Poll> => {
    return apiRequest('/polls', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: Partial<CreatePollData>): Promise<Poll> => {
    return apiRequest(`/polls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/polls/${id}`, {
      method: 'DELETE',
    })
  },

  vote: async (pollId: string, optionId: string): Promise<void> => {
    return apiRequest(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    })
  },

  getUserPolls: async (): Promise<Poll[]> => {
    return apiRequest('/polls/my-polls')
  },
}
