import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")

app = FastAPI(title="ElderCare AI API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize MCP Server
from mcp_server import MCPServer
mcp = MCPServer(supabase)

# Initialize and Register Agents
from agents.health_monitor import HealthMonitorAgent
from agents.care_decision import CareDecisionAgent

health_agent = HealthMonitorAgent(mcp)
care_agent = CareDecisionAgent(mcp, supabase)

mcp.register_agent("health_monitoring_agent", health_agent)
mcp.register_agent("care_decision_agent", care_agent)

# Mock other agents to see the flow continue
class MockCoordAgent:
    async def handle_event(self, event_type, patient_id, payload):
        print(f"[MockCoordAgent] RECEIVED EVENT: {event_type}. Dispatching ambulance simulation...")

mcp.register_agent("emergency_coord_agent", MockCoordAgent())

@app.get("/")
async def root():
    return {"message": "ElderCare AI Backend is Running"}

@app.post("/test-communication")
async def test_communication(patient_id: str = None):
    """
    Simulates a high BP reading and triggers the agent communication flow.
    """
    # 1. Fetch a real patient ID if none provided
    if not patient_id or patient_id == "any-id":
        try:
            patients = supabase.table("patients").select("id").limit(1).execute()
            if patients.data:
                patient_id = patients.data[0]["id"]
            else:
                patient_id = "mock-patient-123"
        except Exception as e:
            print(f"[Supabase Connect Error] Using mock patient ID: {e}")
            patient_id = "mock-patient-123"


    # 2. Mock high BP vitals
    vitals = {
        "bp_systolic": 190,
        "bp_diastolic": 115,
        "heart_rate": 95,
        "notes": "Simulated emergency for comms test"
    }

    # 3. Trigger Health Monitoring Agent
    print(f"\n--- STARTING COMMUNICATION TEST FOR PATIENT {patient_id} ---")
    result = await health_agent.analyze_vitals(patient_id, vitals)
    
    return {
        "status": "triggered",
        "patient_id": patient_id,
        "initial_analysis": result,
        "process": "Check terminal for MCP logs"
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
