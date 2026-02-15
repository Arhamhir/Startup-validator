import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

function Dashboard({ data, onReset }) {
  const { market, engineering, finance, legal, social, critic } = data

  // Prepare chart data
  const demandData = market?.customer_demand_curve?.map((value, index) => ({
    period: `Q${index + 1}`,
    demand: value * 100
  })) || []

  const revenueData = finance?.projected_revenue?.map((revenue, index) => ({
    year: `Year ${index + 1}`,
    revenue: revenue,
    costs: finance.projected_costs?.[index] || 0,
    profit: revenue - (finance.projected_costs?.[index] || 0)
  })) || []

  const timelineData = engineering?.feature_timeline ? 
    Object.entries(engineering.feature_timeline).map(([feature, weeks]) => ({
      feature,
      weeks,
      feasible: engineering.feature_feasibility?.[feature] ? 'Yes' : 'No'
    })) : []

  const socialData = social?.social_score?.map((score, index) => ({
    period: `Period ${index + 1}`,
    score: score * 100,
    reputation: (social.reputation_trend?.[index] || 0) * 100
  })) || []

  const complianceData = legal?.compliance_requirements ?
    Object.entries(legal.compliance_requirements).map(([area, required]) => ({
      name: area,
      value: required ? 1 : 0
    })) : []

  const COLORS = ['#a855f7', '#fbbf24', '#c084fc', '#f59e0b']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dashboard-header">
        <h2 className="dashboard-title">Analysis Results</h2>
        <motion.button
          className="reset-button"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Analysis
        </motion.button>
      </div>

      {/* Critic Summary - Highlighted */}
      {critic && (
        <motion.div className="critic-card" variants={cardVariants}>
          <h3 className="card-title critic-title">Critical Analysis</h3>
          <div className="critic-content">
            <div className="recommendation-badge">
              Recommendation: <span className="recommendation-text">{critic.recommendation}</span>
            </div>
            
            {critic.conflicts && critic.conflicts.length > 0 && (
              <div className="critic-section">
                <h4>Conflicts Identified:</h4>
                <ul className="critic-list">
                  {critic.conflicts.map((conflict, index) => (
                    <li key={index}>{conflict}</li>
                  ))}
                </ul>
              </div>
            )}

            {critic.priority_areas && critic.priority_areas.length > 0 && (
              <div className="critic-section">
                <h4>Priority Areas:</h4>
                <ul className="critic-list priority">
                  {critic.priority_areas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="dashboard-grid">
        {/* Market Analysis */}
        {market && (
          <motion.div className="dashboard-card" variants={cardVariants}>
            <h3 className="card-title">Market Analysis</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                  <XAxis dataKey="period" stroke="#fbbf24" />
                  <YAxis stroke="#fbbf24" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(45, 45, 68, 0.95)',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', r: 6 }}
                    name="Customer Demand %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card-details">
              <div className="detail-section">
                <h4>Opportunities:</h4>
                <ul>
                  {market.opportunities_identified?.map((opp, index) => (
                    <li key={index}>{opp}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>Competitor Reactions:</h4>
                <ul>
                  {market.competitors_reactions?.map((reaction, index) => (
                    <li key={index}>{reaction}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Engineering Analysis */}
        {engineering && (
          <motion.div className="dashboard-card" variants={cardVariants}>
            <h3 className="card-title">Engineering Feasibility</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                  <XAxis dataKey="feature" stroke="#fbbf24" />
                  <YAxis stroke="#fbbf24" label={{ value: 'Weeks', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(45, 45, 68, 0.95)',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="weeks" fill="#a855f7" name="Timeline (weeks)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card-details">
              <div className="detail-section">
                <h4>Feature Feasibility:</h4>
                <div className="feature-list">
                  {Object.entries(engineering.feature_feasibility || {}).map(([feature, feasible]) => (
                    <div key={feature} className="feature-item">
                      <span className={`feature-badge ${feasible ? 'feasible' : 'not-feasible'}`}>
                        {feasible ? '✓' : '✗'}
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h4>Trade-offs:</h4>
                <ul>
                  {engineering.tradeoffs?.map((tradeoff, index) => (
                    <li key={index}>{tradeoff}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Analysis */}
        {finance && (
          <motion.div className="dashboard-card" variants={cardVariants}>
            <h3 className="card-title">Financial Projections</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                  <XAxis dataKey="year" stroke="#fbbf24" />
                  <YAxis stroke="#fbbf24" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(45, 45, 68, 0.95)',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#a855f7" name="Revenue" />
                  <Bar dataKey="costs" fill="#f59e0b" name="Costs" />
                  <Bar dataKey="profit" fill="#fbbf24" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card-details">
              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-value">{finance.cash_runaway_months}</div>
                  <div className="metric-label">Months Cash Runway</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{finance.funding_rounds?.length || 0}</div>
                  <div className="metric-label">Funding Rounds</div>
                </div>
              </div>
              
              {finance.funding_rounds && finance.funding_rounds.length > 0 && (
                <div className="detail-section">
                  <h4>Funding Rounds:</h4>
                  <ul>
                    {finance.funding_rounds.map((round, index) => (
                      <li key={index}>
                        ${round.amount?.toLocaleString()} from {Array.isArray(round.investors) ? round.investors.join(', ') : round.investors}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Legal Analysis */}
        {legal && (
          <motion.div className="dashboard-card" variants={cardVariants}>
            <h3 className="card-title">Legal & Compliance</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value ? COLORS[0] : COLORS[3]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(45, 45, 68, 0.95)',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card-details">
              <div className="detail-section">
                <h4>Regulatory Risks:</h4>
                <ul>
                  {legal.regulatory_risks?.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>Mitigation Strategies:</h4>
                <ul>
                  {legal.mitigation_strategies?.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Analysis */}
        {social && (
          <motion.div className="dashboard-card" variants={cardVariants}>
            <h3 className="card-title">Social Impact</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={socialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                  <XAxis dataKey="period" stroke="#fbbf24" />
                  <YAxis stroke="#fbbf24" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(45, 45, 68, 0.95)',
                      border: '1px solid #a855f7',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#a855f7"
                    strokeWidth={3}
                    name="Social Score %"
                  />
                  <Line
                    type="monotone"
                    dataKey="reputation"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    name="Reputation %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card-details">
              <div className="detail-section">
                <h4>Viral Events:</h4>
                <ul>
                  {social.viral_events?.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Dashboard
