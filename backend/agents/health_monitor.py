import os
from google import genai
from typing import Dict, Any, List
from mcp_server import MCPServer

class HealthMonitorAgent:
    def __init__(self, mcp: MCPServer):
        self.mcp = mcp
        api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-2.0-flash" 

    async def analyze_vitals(self, patient_id: str, vitals_data: Dict[str, Any]):
        """
        Analyzes incoming vitals using rule-based logic and Gemini reasoning.
        """
        systolic = vitals_data.get("bp_systolic")
        diastolic = vitals_data.get("bp_diastolic")
        hr = vitals_data.get("heart_rate")

        severity = "INFO"
        event_type = "NORMAL_LOG"

        # 1. Rule-based Critical Check
        if (systolic and systolic > 180) or (diastolic and diastolic > 110):
            severity = "CRITICAL"
            event_type = "EMERGENCY_VITALS"
        elif hr and (hr < 40 or hr > 150):
            severity = "CRITICAL"
            event_type = "EMERGENCY_VITALS"
        
        # 2. Gemini Reasoning for Summary
        prompt = f"As a medical AI, analyze these elderly patient vitals and provide a 1-sentence summary: {vitals_data}. Patient ID: {patient_id}"
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            reasoning = response.text
        except Exception as e:
            reasoning = f"Automated analysis: {event_type} triggered."
            print(f"[Gemini Error] {e}")

        # 3. Publish to MCP
        await self.mcp.publish_event(
            source_agent="health_monitoring_agent",
            target_agent="care_decision_agent" if severity == "CRITICAL" else "communication_agent",
            event_type=event_type,
            patient_id=patient_id,
            payload={
                "vitals": vitals_data,
                "severity": severity,
                "ai_reasoning": reasoning
            }
        )
        
        return {"event_type": event_type, "severity": severity, "reasoning": reasoning}


