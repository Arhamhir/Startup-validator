from typing import List
from src.models import MarketingAgentOutput


def marketing_node(startup_idea: str, constraints: str) -> MarketingAgentOutput:
    """Creates a simple go-to-market plan from lightweight heuristics."""
    # Use lightweight heuristics so the node is testable without external services.
    constraints_lower = constraints.lower()
    if "low" in constraints_lower or "tight" in constraints_lower:
        budget_tier = "low"
    elif "high" in constraints_lower or "large" in constraints_lower:
        budget_tier = "high"
    else:
        budget_tier = "medium"

    if budget_tier == "low":
        channels = ["content marketing", "community outreach", "partnerships"]
    elif budget_tier == "high":
        channels = ["paid search", "paid social", "events"]
    else:
        channels = ["content marketing", "paid search", "product-led growth"]

    target_segment = "Early adopters with an urgent pain point"
    demand_score = 0.6
    positioning = f"A focused solution for: {startup_idea.strip() or 'the stated problem'}"
    launch_plan = [
        "Define a single core use case and build a landing page",
        "Run 5 customer interviews and refine messaging",
        "Ship a small MVP and measure signup-to-activation",
    ]
    risks = [
        "Target segment may be too broad",
        "Channel costs may exceed initial budget",
    ]

    return MarketingAgentOutput(
        target_segment=target_segment,
        demand_score=demand_score,
        channels_ranked=channels,
        positioning=positioning,
        launch_plan=launch_plan,
        risks=risks,
    )
