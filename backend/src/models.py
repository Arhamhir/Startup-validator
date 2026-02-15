from typing import List,Optional,Any,Dict
from pydantic import BaseModel
from langchain_groq import ChatGroq
from typing_extensions import TypedDict
from langgraph.graph import add_messages
from typing import Annotated


def merge_agent_outputs(left: Optional[dict], right: Optional[dict]) -> dict:
    """Merge agent outputs from concurrent nodes (reason: allow parallel execution)."""
    if left is None:
        return right or {}
    if right is None:
        return left
    return {**left, **right}

# --------------------------------------------
# User side data validation models
# --------------------------------------------
class StartupIdea(BaseModel):
    """Basic structure for the startup idea"""
    name:str
    description:str
    team_size:int
    target_market:str
    industry:str
    budget:float
    timeline_months:str

class UserConstraints(BaseModel):
    """To help the agent decide user needs and constraints"""
    max_budget:float
    timeline_months:str
    compliance_requirements:Optional[List[str]]=None


# --------------------------------------------
# nodes output validation models
# --------------------------------------------
class MarketAgentOutput(BaseModel):
    """Researches market and provides structured output"""
    customer_demand_curve:List[float]
    competitors_reactions:List[str]
    opportunities_identified:List[str]
class EnginneerAgentOutput(BaseModel):
    """Provides technical insights and recommendations"""
    feature_feasibility:Dict[str,bool]
    feature_timeline:Dict[str,int]  # Features into weeks
    tradeoffs:List[str]

class FinanceAgentOutput(BaseModel):
    """Financial analysis and projections"""
    projected_revenue:List[float]
    projected_costs:List[float]
    funding_rounds:List[Dict[str,Any]] # Investors, Date, amount
    cash_runaway_months:float

class LegalAgentOutput(BaseModel):
    """Legal and compliance insights"""
    regulatory_risks:List[str]
    mitigation_strategies:List[str]
    compliance_requirements:Dict[str,bool]

class SocialAgentOutput(BaseModel):
    """Social and ethical considerations"""
    social_score:List[float]
    reputation_trend:List[float]
    viral_events:List[str]

class CriticAgentOutput(BaseModel):
    """Critical analysis and feedback"""
    conflicts:List[str]
    recommendation:str # pivot, cut, all-in, etc.
    priority_areas:List[str]


# --------------------------------------------
# State management models
# --------------------------------------------
class AgentState(BaseModel):
    """Structured state for each agent's output"""
    market:Optional[MarketAgentOutput]=None
    engineering:Optional[EnginneerAgentOutput]=None
    finance:Optional[FinanceAgentOutput]=None
    legal:Optional[LegalAgentOutput]=None
    social:Optional[SocialAgentOutput]=None
    critic:Optional[CriticAgentOutput]=None

# Use TypedDict for LangGraph state to support concurrent updates (reason: avoid InvalidUpdateError)
class SimulationState(TypedDict):
    """Overall state of the simulation"""
    startup_idea: StartupIdea
    user_constraints: UserConstraints
    agent_outputs: Annotated[dict, merge_agent_outputs]
    iteration: int


# --------------------------------------------
# Frontend models
# --------------------------------------------
class DashboardData(BaseModel):
    """Data structure for frontend dashboard"""
    growth_trajectory:List[float]
    feature_delivery:Dict[str,Any] 
    cash_runaway:float  
    agent_boardroom_debate:Dict[str,List[str]]
    recommendation:str

# DTO's (Data Transfer Objects) for easier API communication
class SimulationRequest:
    StartupIdea,
    UserConstraints

class SimulationResponse:
    DashboardData
    SimulationState

# LLM model factory for easy swapping
def llm_model():
    # Use JSON mode to enforce structured output from the LLM (reason: avoid parsing errors)
    return ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.1,
        model_kwargs={"response_format": {"type": "json_object"}}
    )