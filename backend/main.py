from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routes import analyze
import os

app = FastAPI(title="SEA Money Flow Intelligence API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes under /api
app.include_router(analyze.router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}

# Serve frontend static files
dist_path = os.path.join(os.getcwd(), "dist")
if os.path.exists(dist_path):
    # Mount assets directory for static files (JS, CSS, images)
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # Handle SPA routing: serve index.html for any non-API route
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Check if the path exists in dist (for favicon.ico, etc.)
        if full_path:
            file_path = os.path.join(dist_path, full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
        
        # If it's an API route or health check that didn't match, return 404
        if full_path.startswith("api") or full_path == "health":
            raise HTTPException(status_code=404, detail="Not Found")
        
        # Otherwise, serve index.html for SPA routing
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        
        return {"error": "Frontend not built"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
