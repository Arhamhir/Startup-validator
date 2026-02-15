import os
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from src.models import StartupIdea, UserConstraints
from src.workflow import Workflow

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication


def _load_env_file(env_path: Path) -> None:
    """Loads key=value pairs into the environment if not already set."""
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if not line or line.strip().startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


# Load environment variables at startup
project_root = Path(__file__).resolve().parent.parent
_load_env_file(project_root / ".env")


@app.route("/api/validate", methods=["POST"])
def validate_startup():
    """API endpoint to validate startup ideas and return agent analysis."""
    try:
        data = request.json
        
        # Extract and validate input
        startup_idea = StartupIdea(
            name=data.get("name", ""),
            description=data.get("description", ""),
            team_size=int(data.get("team_size", 0)),
            target_market=data.get("target_market", ""),
            industry=data.get("industry", ""),
            budget=float(data.get("budget", 0)),
            timeline_months=data.get("timeline_months", ""),
        )
        
        constraints = UserConstraints(
            max_budget=float(data.get("max_budget", 0)),
            timeline_months=data.get("constraints_timeline", ""),
            compliance_requirements=data.get("compliance_requirements"),
        )
        
        # Run workflow
        workflow = Workflow()
        workflow.run_simulation(startup_idea, constraints)
        
        # Return results
        return jsonify({
            "success": True,
            "data": workflow.state["agent_outputs"]
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
