import os
from pathlib import Path
from src.models import StartupIdea, UserConstraints
from src.workflow import Workflow


def _load_env_file(env_path: Path) -> None:
    """Loads key=value pairs into the environment if not already set.

    Reason: ensure GROQ_API_KEY is available without extra dependencies.
    """
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if not line or line.strip().startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def _prompt_int(label: str) -> int:
    while True:
        try:
            return int(input(f"{label}: ").strip())
        except ValueError:
            print("Please enter an integer value.")


def _prompt_float(label: str) -> float:
    while True:
        try:
            return float(input(f"{label}: ").strip())
        except ValueError:
            print("Please enter a numeric value.")


def _prompt_text(label: str) -> str:
    return input(f"{label}: ").strip()


def _build_inputs() -> tuple[StartupIdea, UserConstraints]:
    """Collects user input for a test run.

    Reason: avoid hardcoded dummy data while keeping the workflow testable.
    """
    name = _prompt_text("Startup name")
    description = _prompt_text("Description")
    team_size = _prompt_int("Team size")
    target_market = _prompt_text("Target market")
    industry = _prompt_text("Industry")
    budget = _prompt_float("Budget")
    timeline_months = _prompt_text("Timeline months")

    max_budget = _prompt_float("Max budget")
    constraints_timeline = _prompt_text("Constraint timeline months")
    compliance_raw = _prompt_text("Compliance requirements (comma-separated, optional)")
    compliance = [item.strip() for item in compliance_raw.split(",") if item.strip()] or None

    startup_idea = StartupIdea(
        name=name,
        description=description,
        team_size=team_size,
        target_market=target_market,
        industry=industry,
        budget=budget,
        timeline_months=timeline_months,
    )
    user_constraints = UserConstraints(
        max_budget=max_budget,
        timeline_months=constraints_timeline,
        compliance_requirements=compliance,
    )
    return startup_idea, user_constraints


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    _load_env_file(project_root / ".env")

    startup_idea, user_constraints = _build_inputs()
    workflow = Workflow()
    workflow.run_simulation(startup_idea, user_constraints)
    print("\nSimulation complete. Agent outputs:")
    # Access dict-based state directly (reason: switched to TypedDict for LangGraph compatibility)
    print(workflow.state["agent_outputs"])
