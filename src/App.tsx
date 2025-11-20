import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <h1>Running Routes App</h1>
          <p>Your project is set up and ready to go! 🎉</p>
          <Routes>
            <Route path="/" element={<div>Home Page - Coming Soon</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
