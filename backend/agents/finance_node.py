from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
from src.models import FinanceAgentOutput, StartupIdea, UserConstraints, llm_model
from src.prompts import StartupToolPrompts
from src.utils import parse_json_from_llm

def finance_node(startup_idea: StartupIdea, constraints: UserConstraints) -> FinanceAgentOutput: 
    """Analyzes financial viability and provides structured output"""
    llm = llm_model()
    # Serialize structured inputs for the prompt to keep model usage consistent.
    startup_text = (
        f"Name: {startup_idea.name}\n"
        f"Description: {startup_idea.description}\n"
        f"Team size: {startup_idea.team_size}\n"
        f"Target market: {startup_idea.target_market}\n"
        f"Industry: {startup_idea.industry}\n"
        f"Budget: {startup_idea.budget}\n"
        f"Timeline months: {startup_idea.timeline_months}"
    )
    constraints_text = (
        f"Max budget: {constraints.max_budget}\n"
        f"Timeline months: {constraints.timeline_months}\n"
        f"Compliance requirements: {constraints.compliance_requirements}"
    )
    json_instruction = (
        "Return ONLY JSON with keys: projected_revenue (list of floats), "
        "projected_costs (list of floats), funding_rounds (list of objects with amount, date, investors), "
        "cash_runaway_months (float)."
    )
    messages = [
        SystemMessage(content=StartupToolPrompts.SYSTEM_FINANCIAL_ANALYSIS),
        HumanMessage(
            content=StartupToolPrompts.financial_analysis_user(startup_text, constraints_text)
            + "\n\n"
            + json_instruction
        ),
    ]
    response = llm.invoke(messages)
    parsed = parse_json_from_llm(response.content)
    return FinanceAgentOutput(**parsed)