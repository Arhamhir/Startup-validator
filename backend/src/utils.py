import json
import re


def parse_json_from_llm(content: str) -> dict:
    """Extracts the first JSON object from LLM output.

    Reason: keep agents simple while tolerating extra text around JSON.
    """
    # Try to find JSON block markers first (```json ... ```)
    json_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
    if json_block_match:
        return json.loads(json_block_match.group(1))
    
    # Fall back to extracting the first complete JSON object
    start = content.find("{")
    end = content.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"LLM response did not contain a JSON object. Response: {content[:200]}")
    
    json_str = content[start : end + 1]
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        # Log the problematic content for debugging
        raise ValueError(
            f"Failed to parse JSON from LLM response. Error: {e}\n"
            f"Extracted content (first 300 chars): {json_str[:300]}"
        ) from e
