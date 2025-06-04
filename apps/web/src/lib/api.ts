// API client for Garden Calm backend

interface ApiResponse {
  message: string;
  emotionCode?: string;
  suggestions?: string[];
}

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Function to send a message to the backend
export async function sendMessage(message: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    // Return a fallback response if the API call fails
    return {
      message: "I'm having trouble connecting to the server. Please try again later.",
    };
  }
}

// Function to establish WebSocket connection (for future use)
export function connectWebSocket(
  onMessage: (data: any) => void,
  onError: (error: Event) => void
): WebSocket | null {
  try {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3000/ws';
    const socket = new WebSocket(wsUrl);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = onError;
    
    return socket;
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    return null;
  }
}
