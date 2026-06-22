const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface RegisterData {
  fullName?: string;
  email?: string;
  role?: string;
  password?: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      role: data.role,
      password: data.password
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Registration failed');
  }

  return result;
};
