import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleCalendarIntegration from '../GoogleCalendarIntegration';

// Mock the Google API
const mockGapi = {
  client: {
    init: jest.fn().mockResolvedValue(undefined),
    calendar: {
      calendarList: {
        list: jest.fn().mockResolvedValue({ result: { items: [] } }),
      },
      events: {
        list: jest.fn().mockResolvedValue({ result: { items: [] } }),
        insert: jest.fn().mockResolvedValue({ result: {} }),
        update: jest.fn().mockResolvedValue({ result: {} }),
        delete: jest.fn().mockResolvedValue({ result: {} }),
      },
    },
  },
  auth2: {
    getAuthInstance: jest.fn().mockReturnValue({
      isSignedIn: {
        get: jest.fn().mockReturnValue(false),
      },
      signIn: jest.fn().mockResolvedValue(undefined),
      signOut: jest.fn().mockResolvedValue(undefined),
    }),
  },
};

// Mock window.gapi
Object.defineProperty(window, 'gapi', {
  value: mockGapi,
  writable: true,
});

describe('GoogleCalendarIntegration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<GoogleCalendarIntegration />);
    expect(screen.getByRole('heading', { name: /Google Calendar Integration/i })).toBeInTheDocument();
  });

  it('shows sign in button when not authenticated', () => {
    render(<GoogleCalendarIntegration />);
    expect(screen.getByRole('button', { name: /Connect Google Calendar/i })).toBeInTheDocument();
  });

  it('handles sign in process', async () => {
    render(<GoogleCalendarIntegration />);
    
    // Click the sign in button
    const signInButton = screen.getByRole('button', { name: /Connect Google Calendar/i });
    fireEvent.click(signInButton);

    // Wait for the sign in process
    await waitFor(() => {
      expect(mockGapi.auth2.getAuthInstance().signIn).toHaveBeenCalled();
    });
  });

  it('handles sign out process', async () => {
    // Mock authenticated state
    mockGapi.auth2.getAuthInstance().isSignedIn.get.mockReturnValue(true);

    render(<GoogleCalendarIntegration />);
    
    // Click the sign out button
    const signOutButton = screen.getByRole('button', { name: /Disconnect/i });
    fireEvent.click(signOutButton);

    // Wait for the sign out process
    await waitFor(() => {
      expect(mockGapi.auth2.getAuthInstance().signOut).toHaveBeenCalled();
    });
  });

  it('fetches calendars when authenticated', async () => {
    // Mock authenticated state
    mockGapi.auth2.getAuthInstance().isSignedIn.get.mockReturnValue(true);

    render(<GoogleCalendarIntegration />);

    // Wait for calendars to be fetched
    await waitFor(() => {
      expect(mockGapi.client.calendar.calendarList.list).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
}); 