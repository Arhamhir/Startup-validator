import { useState } from 'react'
import './App.css'
import InputForm from './components/InputForm'
import Dashboard from './components/Dashboard'

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const handleAnalyze = async (formData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setAnalysisData(result.data)
      } else {
        setError(result.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setAnalysisData(null)
    setError(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Startup Idea Validator</h1>
        <p className="app-subtitle">AI-Powered Multi-Agent Analysis System</p>
      </header>
      
      {!analysisData ? (
        <InputForm 
          onSubmit={handleAnalyze} 
          loading={loading}
          error={error}
        />
      ) : (
        <Dashboard 
          data={analysisData} 
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default App
