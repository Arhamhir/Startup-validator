from typing import Dict,Any,List
from langgraph.graph import StateGraph, END, START
from agents import market_node, engineering_node, finance_node, legal_node, social_node, critic_node
from src.models import StartupIdea, UserConstraints, SimulationState

class Workflow:
    def __init__(self):
        # Initialize with TypedDict-compatible structure (reason: support concurrent updates)
        self.state: SimulationState = {
            "startup_idea": StartupIdea(
                name="",
                description="",
                team_size=0,
                target_market="",
                industry="",
                budget=0.0,
                timeline_months="",
            ),
            "user_constraints": UserConstraints(
                max_budget=0.0,
                timeline_months="",
                compliance_requirements=None,
            ),
            "agent_outputs": {},
            "iteration": 0,
        }

    def _build_graph(self):
        graph = StateGraph(SimulationState)

        graph.add_node("market", self._run_market_agent)
        graph.add_node("engineering", self._run_engineering_agent)
        graph.add_node("finance", self._run_finance_agent)
        graph.add_node("legal", self._run_legal_agent)
        graph.add_node("social", self._run_social_agent)
        graph.add_node("critic", self._run_critic_agent)

        graph.add_edge(START, "market")
        graph.add_edge(START, "engineering")
        graph.add_edge(START, "finance")
        graph.add_edge(START, "legal")
        graph.add_edge(START, "social")

        # Fan-in explicitly to avoid API ambiguity.
        graph.add_edge("market", "critic")
        graph.add_edge("engineering", "critic")
        graph.add_edge("finance", "critic")
        graph.add_edge("legal", "critic")
        graph.add_edge("social", "critic")
        graph.add_edge("critic", END)
        return graph.compile()
        
    def run_simulation(self, startup_idea: StartupIdea, constraints: UserConstraints):
        # Accept structured inputs to keep validation consistent.
        self.state["startup_idea"] = startup_idea
        self.state["user_constraints"] = constraints
        graph = self._build_graph()
        result = graph.invoke(self.state)
        # Update local state with final result (reason: make outputs accessible after run)
        self.state = result

    def _run_market_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        result = market_node(state["startup_idea"], state["user_constraints"])
        return {"agent_outputs": {"market": result.model_dump()}}

    def _run_engineering_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        result = engineering_node(state["startup_idea"], state["user_constraints"])
        return {"agent_outputs": {"engineering": result.model_dump()}}

    def _run_finance_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        result = finance_node(state["startup_idea"], state["user_constraints"])
        return {"agent_outputs": {"finance": result.model_dump()}}

    def _run_legal_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        result = legal_node(state["startup_idea"], state["user_constraints"])
        return {"agent_outputs": {"legal": result.model_dump()}}

    def _run_social_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        result = social_node(state["startup_idea"], state["user_constraints"])
        return {"agent_outputs": {"social": result.model_dump()}}
        
    def _run_critic_agent(self, state: SimulationState):
        # Return only the specific agent output to allow parallel execution (reason: LangGraph reducer)
        outputs = state["agent_outputs"]
        result = critic_node(
            market_analysis=str(outputs.get("market", {})),
            engineering_analysis=str(outputs.get("engineering", {})),
            financial_analysis=str(outputs.get("finance", {})),
            legal_analysis=str(outputs.get("legal", {})),
            social_analysis=str(outputs.get("social", {}))
        )
        return {"agent_outputs": {"critic": result.model_dump()}}

    

