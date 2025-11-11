import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <h1>Running Routes App</h1>
        <p>Your project is set up and ready to go! 🎉</p>
        <Routes>
          <Route path="/" element={<div>Home Page - Coming Soon</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
