/**
 * AUTH TEST UTILITIES
 * Temporary test functions for Phase 2 backend authentication testing
 * Will be replaced with proper React components in Phase 3
 */

// Type definitions for API responses
interface LoginResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    username: string;
  };
}

interface ErrorResponse {
  error: string;
}

interface RoutesResponse {
  count: number;
  routes: any[];
}

// Initialize login form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;

  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
});

/**
 * Handle login form submission
 */
async function handleLoginSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send/receive cookies
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse | ErrorResponse = await response.json();

    if (response.ok) {
      const loginData = data as LoginResponse;

      // Store the token in localStorage
      localStorage.setItem('token', loginData.token);
      console.log('Token saved to localStorage:', loginData.token);

      showSuccess(resultDiv, loginData);
    } else {
      const errorData = data as ErrorResponse;
      showError(resultDiv, errorData.error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    showError(resultDiv, errorMessage);
  }
}

/**
 * Display success message with token and user info
 */
function showSuccess(resultDiv: HTMLDivElement, data: LoginResponse): void {
  resultDiv.style.display = 'block';
  resultDiv.style.backgroundColor = '#d4edda';
  resultDiv.style.color = '#155724';
  resultDiv.innerHTML = `
    <strong>Success!</strong><br/>
    Token: ${data.token.substring(0, 20)}...<br/>
    User: ${data.user.username} (${data.user.email})<br/>
    <br/>
    <button onclick="testProtectedRoute()" style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">
      Test Protected Route (GET /api/routes)
    </button>
  `;
  console.log('Full response:', data);
}

/**
 * Display error message
 */
function showError(resultDiv: HTMLDivElement, errorMessage: string): void {
  resultDiv.style.display = 'block';
  resultDiv.style.backgroundColor = '#f8d7da';
  resultDiv.style.color = '#721c24';
  resultDiv.innerHTML = `<strong>Error:</strong> ${errorMessage}`;
}

/**
 * Test calling a protected route with Authorization header
 * This function is called from the inline button in the success message
 */
async function testProtectedRoute(): Promise<void> {
  const token = localStorage.getItem('token');
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  if (!token) {
    alert('No token found. Please login first.');
    return;
  }

  try {
    console.log('Calling GET /api/routes with Authorization header...');
    const response = await fetch('http://localhost:5000/api/routes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Bearer token in Authorization header
      },
    });

    const data: RoutesResponse | ErrorResponse = await response.json();

    if (response.ok) {
      const routesData = data as RoutesResponse;
      resultDiv.style.backgroundColor = '#d1ecf1';
      resultDiv.style.color = '#0c5460';
      resultDiv.innerHTML = `
        <strong>Protected Route Success!</strong><br/>
        Response: ${JSON.stringify(routesData, null, 2)}
      `;
      console.log('Protected route response:', routesData);
    } else {
      const errorData = data as ErrorResponse;
      resultDiv.style.backgroundColor = '#f8d7da';
      resultDiv.style.color = '#721c24';
      resultDiv.innerHTML = `<strong>Protected Route Error:</strong> ${errorData.error || response.statusText}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    resultDiv.style.backgroundColor = '#f8d7da';
    resultDiv.style.color = '#721c24';
    resultDiv.innerHTML = `<strong>Error:</strong> ${errorMessage}`;
  }
}

// Make testProtectedRoute available globally for the inline button onclick
// In Phase 3, this will be replaced with proper React event handlers
(window as any).testProtectedRoute = testProtectedRoute;
