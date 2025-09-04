
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatePollPage from './page';
import { useRouter } from 'next/navigation';
import * as SupabaseClient from '@/lib/supabase';

import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: { id: '123', title: 'Test Poll' }, error: null })),
        })),
      })),
    })),
  })),
}));

describe('CreatePollPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  const renderWithAuthProvider = (component) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it('renders the create poll form', () => {
    renderWithAuthProvider(<CreatePollPage />);
    expect(screen.getByRole('heading', { name: /Create New Poll/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Poll Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 2/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 3/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Add Another Option/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Poll/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    renderWithAuthProvider(<CreatePollPage />);
    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });
    expect(titleInput).toHaveValue('My Test Poll');

    const descriptionTextarea = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionTextarea, { target: { name: 'description', value: 'This is a test description.' } });
    expect(descriptionTextarea).toHaveValue('This is a test description.');

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    expect(option1Input).toHaveValue('Option A');
  });

  it('adds and removes options', () => {
    renderWithAuthProvider(<CreatePollPage />);
    const addOptionButton = screen.getByRole('button', { name: /\+ Add Another Option/i });
    fireEvent.click(addOptionButton);
    expect(screen.getByPlaceholderText(/Option 4/i)).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(removeButtons[0]); // Remove Option 1
    expect(screen.queryByPlaceholderText(/Option 1/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 2/i)).toBeInTheDocument(); // Original Option 2 is now Option 1 visually
  });

  it('shows error if title is missing on submit', async () => {
    renderWithAuthProvider(<CreatePollPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));
    await waitFor(() => {
      expect(screen.getByText(/Title and category are required/i)).toBeInTheDocument();
    });
  });

  it('shows error if category is missing on submit', async () => {
    renderWithAuthProvider(<CreatePollPage />);
    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));
    await waitFor(() => {
      expect(screen.getByText(/Title and category are required/i)).toBeInTheDocument();
    });
  });

  it('shows error if less than 2 options are provided', async () => {
    renderWithAuthProvider(<CreatePollPage />);
    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });

    fireEvent.click(screen.getByText(/Select a category/i));
    fireEvent.click(screen.getByText(/Technology/i));

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Only one option' } });
    const option2Input = screen.getByPlaceholderText(/Option 2/i);
    fireEvent.change(option2Input, { target: { value: '' } });
    const option3Input = screen.getByPlaceholderText(/Option 3/i);
    fireEvent.change(option3Input, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));
    await waitFor(() => {
      expect(screen.getByText(/At least 2 options are required/i)).toBeInTheDocument();
    });
  });

  it('successfully creates a poll and redirects', async () => {
    renderWithAuthProvider(<CreatePollPage />);

    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });

    fireEvent.click(screen.getByText(/Select a category/i));
    fireEvent.click(screen.getByText(/Technology/i));

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    const option2Input = screen.getByPlaceholderText(/Option 2/i);
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(SupabaseClient.createClient).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('Poll created successfully!');
      expect(mockPush).toHaveBeenCalledWith('/polls');
    });
    alertMock.mockRestore();
  });

  it('displays error if poll creation fails', async () => {
    // Mock supabase to return an error for poll insertion
    (SupabaseClient.createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: { message: 'DB Error' } })),
          })),
        })),
      })),
    });

    renderWithAuthProvider(<CreatePollPage />);

    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });

    fireEvent.click(screen.getByText(/Select a category/i));
    fireEvent.click(screen.getByText(/Technology/i));

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    const option2Input = screen.getByPlaceholderText(/Option 2/i);
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create poll. Please try again./i)).toBeInTheDocument();
    });
  });

  it('displays error if option creation fails', async () => {
    // Mock supabase to return an error for option insertion
    (SupabaseClient.createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        insert: jest.fn((tableName) => {
          if (tableName === 'polls') {
            return {
              select: jest.fn(() => ({
                single: jest.fn(() => ({ data: { id: '123', title: 'Test Poll' }, error: null })),
              })),
            };
          } else if (tableName === 'options') {
            return { error: { message: 'Options DB Error' } };
          }
          return { error: null };
        }),
      })),
    });

    renderWithAuthProvider(<CreatePollPage />);

    const titleInput = screen.getByLabelText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'My Test Poll' } });

    fireEvent.click(screen.getByText(/Select a category/i));
    fireEvent.click(screen.getByText(/Technology/i));

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Option A' } });
    const option2Input = screen.getByPlaceholderText(/Option 2/i);
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Poll/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create poll options. Please try again./i)).toBeInTheDocument();
    });
  });
});
