# Startup Idea Validator

AI-Powered Multi-Agent Startup Analysis System with Beautiful Dashboard

## Features

- Multi-agent AI analysis (Market, Engineering, Finance, Legal, Social, Critic)
- Interactive charts and visualizations
- Beautiful UI with purple, yellow, and black theme
- Smooth animations and transitions
- Responsive design

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r ../requirements.txt
   ```

2. **Make sure your `.env` file has the GROQ API key:**
   ```
   GROQ_API_KEY=your_api_key_here
   GROQ_MODEL=llama-3.1-8b-instant
   ```

3. **Start the Flask API server:**
   ```bash
   python api.py
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd startup-idea-validator
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Fill in the startup information form:
   - Startup name
   - Description
   - Industry
   - Target market
   - Team size
   - Budget details
   - Timeline and constraints
3. Click "Analyze Startup Idea"
4. View the comprehensive dashboard with:
   - Critical analysis and recommendations
   - Market demand curves and opportunities
   - Engineering feasibility and timelines
   - Financial projections and funding rounds
   - Legal compliance and risks
   - Social impact metrics

## Tech Stack

### Backend
- Python 3.11+
- Flask (API server)
- LangChain + Groq (AI agents)
- LangGraph (workflow orchestration)
- Pydantic (data validation)

### Frontend
- React 19
- Vite (build tool)
- Recharts (data visualization)
- Framer Motion (animations)
- CSS3 (custom styling)

## Color Theme

- Primary Purple: `#a855f7`
- Primary Yellow: `#fbbf24`
- Background Black: `#000000`
- Card Background: `#1a0033`

## Project Structure

```
Startup/
├── backend/
│   ├── agents/          # AI agent nodes
│   ├── src/             # Models, prompts, workflow
│   ├── api.py           # Flask API server
│   └── main.py          # CLI testing tool
├── startup-idea-validator/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── *.css        # Styling files
│   └── package.json
└── requirements.txt
```

## Notes

- Make sure both backend and frontend servers are running simultaneously
- The analysis may take 30-60 seconds depending on the LLM response time
- All agent outputs are displayed with interactive charts and detailed breakdowns
