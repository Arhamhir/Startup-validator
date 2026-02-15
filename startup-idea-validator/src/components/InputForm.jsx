import { useState } from 'react'
import { motion } from 'framer-motion'
import './InputForm.css'

function InputForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_size: '',
    target_market: '',
    industry: '',
    budget: '',
    timeline_months: '',
    max_budget: '',
    constraints_timeline: '',
    compliance_requirements: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <motion.div
      className="form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-section">
          <h2 className="section-title">Startup Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Startup Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your startup name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry *</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., FinTech, HealthTech"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your startup idea in detail..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="target_market">Target Market *</label>
              <input
                type="text"
                id="target_market"
                name="target_market"
                value={formData.target_market}
                onChange={handleChange}
                placeholder="e.g., Small businesses, Millennials"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="team_size">Team Size *</label>
              <input
                type="number"
                id="team_size"
                name="team_size"
                value={formData.team_size}
                onChange={handleChange}
                placeholder="Number of team members"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Initial Budget ($) *</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 50000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeline_months">Timeline (months) *</label>
              <input
                type="text"
                id="timeline_months"
                name="timeline_months"
                value={formData.timeline_months}
                onChange={handleChange}
                placeholder="e.g., 12-18"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Constraints</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="max_budget">Maximum Budget ($) *</label>
              <input
                type="number"
                id="max_budget"
                name="max_budget"
                value={formData.max_budget}
                onChange={handleChange}
                placeholder="e.g., 100000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="constraints_timeline">Constraint Timeline *</label>
              <input
                type="text"
                id="constraints_timeline"
                name="constraints_timeline"
                value={formData.constraints_timeline}
                onChange={handleChange}
                placeholder="e.g., 18 months"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="submit-button"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              Analyzing...
            </span>
          ) : (
            'Analyze Startup Idea'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default InputForm
