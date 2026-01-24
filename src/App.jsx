import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Routes>
          <Route path="/" element={<h1 className="text-white text-4xl p-8">🎬 CineBooking - Home</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App