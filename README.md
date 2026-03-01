# Startup Idea Validator

A multi-agent AI analysis system that evaluates startup ideas using specialized LLM agents. It performs feasibility analysis across market, engineering, finance, legal, and social dimensions, then synthesizes findings into a confident recommendation.

**Live Deployment:**
- https://startup-validator-frontend.vercel.app

---

## How It Works

### User Journey
1. **Input Form**: User enters startup details (name, description, team size, budget, timeline, constraints)
2. **Parallel Analysis**: 6 specialized agents run simultaneously:
   - **Market** Agent: Demand curves, competitors, market opportunities, TAM analysis
   - **Engineering** Agent: Technical feasibility, development timeline, tech stack tradeoffs
   - **Finance** Agent: Revenue/cost projections, funding rounds, burn rate calculations
   - **Legal** Agent: Regulatory risks, compliance requirements, IP considerations
   - **Social** Agent: Social impact trends, reputation risks, brand alignment
3. **Critic Synthesis**: Aggregates outputs, flags conflicts, returns decision (proceed / proceed_with_caution / pivot / stop)
4. **Results Dashboard**: Interactive charts showing all agent outputs with detailed breakdowns

### Architecture

The system uses **LangGraph** for workflow orchestration:
- 5 analysis agents run in **parallel** for speed
- All results feed into a **fan-in** to the Critic agent
- Critic node synthesizes analysis and returns final recommendation

```
          ┌─→ Market Agent ─┐
          │                  │
Input ────┼─→ Engineering ───┤
          │                  ├─→ Critic → Output
          ├─→ Finance ───────┤
          │                  │
          ├─→ Legal ─────────┤
          │                  │
          └─→ Social Agent ──┘
```

---

## Tech Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: Flask (lightweight REST API)
- **LLM Integration**: LangChain, Groq (llama-3.1-8b-instant)
- **Workflow**: LangGraph (DAG-based agent orchestration)
- **Validation**: Pydantic (structured data models)
- **Deployment**: Vercel (serverless functions)

### Frontend
- **Framework**: React 19 (Vite)
- **Visualization**: Recharts (interactive charts)
- **Animation**: Framer Motion (smooth transitions)
- **Styling**: CSS3 (custom dark theme with purple/yellow accents)
- **Deployment**: Vercel (static site)

### State Management
- **TypedDict** + **Annotated reducers** for concurrent agent execution
- Partial updates from each agent node merge safely via custom reducer function
- Avoids Pydantic BaseModel mutability issues with LangGraph

---

## Performance & Optimization

### Backend
- **Concurrent agents**: ~10-30s total 
- **JSON parsing**: Regex-based extraction tolerates minor LLM formatting variance
- **CORS enabled**: Allows requests from any frontend origin

### Frontend
- **Vite dev server**: Sub-second HMR
- **Production build**: ~150KB gzipped (React + Recharts + Framer Motion)
- **Chart rendering**: Recharts optimized for ~200 data points per chart

