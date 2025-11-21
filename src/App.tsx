import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <h1>Running Routes App</h1>
          <div className="bg-blue-500 text-white p-4 rounded">
            Tailwind works! 🎉
          </div>
          <p>Your project is set up and ready to go! 🎉</p>
          <Routes>
            <Route path="/" element={<div>Home Page - Coming Soon</div>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
