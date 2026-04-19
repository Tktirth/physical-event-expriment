from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="OmniFlow Queue Intelligence Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class POIState(BaseModel):
    poi_id: str
    zone_id: str
    active_devices_in_radius: int  # Derived from Flink (L in Little's Law)
    transactions_per_minute: float # Derived from POS integration (λ)
    historical_avg_wait: float

class WaitTimeResponse(BaseModel):
    poi_id: str
    estimated_wait_time_minutes: float
    confidence_score: float
    status: str

@app.post("/api/v1/predict/queue", response_model=WaitTimeResponse)
async def predict_queue_wait_time(state: POIState):
    """
    Implements Little's Law (L = λW) to derive W (Wait Time) dynamically.
    L: Average number of items in the queuing system.
    λ: Average arrival/completion rate.
    W: Average waiting time in the system.
    
    Rearranged for W: W = L / λ
    """
    
    # 1. Fallback heuristic if POS is offline or no transactional throughput
    if state.transactions_per_minute <= 0.1:
        # Fallback to historical EMA blending
        fallback_w = np.average([state.historical_avg_wait, state.active_devices_in_radius * 0.5])
        return WaitTimeResponse(
            poi_id=state.poi_id,
            estimated_wait_time_minutes=round(fallback_w, 1),
            confidence_score=0.4, # Low confidence due to no live throughput
            status="WARNING_HEURISTIC_FALLBACK"
        )
        
    # 2. Apply Little's Law calculation
    # L = state.active_devices_in_radius
    # lambda = state.transactions_per_minute
    w = state.active_devices_in_radius / state.transactions_per_minute
    
    # Cap maximum prediction bounds logic to prevent runaway estimates
    w = min(max(w, 0.0), 90.0) 
    
    status = "NORMAL"
    if w > 15.0:
        status = "CRITICAL_CONGESTION"
    elif w > 8.0:
        status = "BUSY"

    return WaitTimeResponse(
        poi_id=state.poi_id,
        estimated_wait_time_minutes=round(w, 1),
        confidence_score=0.92,
        status=status
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
