from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
from src.models import CriticAgentOutput, llm_model
from src.prompts import StartupToolPrompts
from src.utils import parse_json_from_llm


def critic_node(
	market_analysis: str,
	engineering_analysis: str,
	financial_analysis: str,
	legal_analysis: str,
	social_analysis: str,
) -> CriticAgentOutput:
	"""Critiques outputs across agents and recommends next steps."""
	llm = llm_model()
	json_instruction = (
		"Return ONLY JSON with keys: conflicts (list of strings), "
		"recommendation (string), priority_areas (list of strings)."
	)
	messages = [
		SystemMessage(content=StartupToolPrompts.SYSTEM_CRITIC_ANALYSIS),
		HumanMessage(
			content=StartupToolPrompts.critic_analysis_user(
				market_analysis,
				engineering_analysis,
				financial_analysis,
				legal_analysis,
				social_analysis,
			)
			+ "\n\n"
			+ json_instruction
		),
	]
	response = llm.invoke(messages)
	parsed = parse_json_from_llm(response.content)
	return CriticAgentOutput(**parsed)

