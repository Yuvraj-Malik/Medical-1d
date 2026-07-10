const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const predictPOPF = async (data) => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};
