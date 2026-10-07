# 1. Update backend to support disconnect
main_py = 'c:/Users/dell/meta/backend/main.py'
with open(main_py, 'r', encoding='utf-8') as f:
    backend = f.read()

if "/api/meta/disconnect" not in backend:
    backend += """
@app.post("/api/meta/disconnect")
def disconnect_meta():
    db["is_meta_connected"] = False
    db["meta_account_id"] = None
    db["meta_account_name"] = None
    return {"success": True, "message": "Disconnected"}
"""
    with open(main_py, 'w', encoding='utf-8') as f:
        f.write(backend)

# 2. Update CampaignBuilder.tsx to show a disconnect option
cb_path = 'c:/Users/dell/meta/frontend/src/pages/CampaignBuilder.tsx'
with open(cb_path, 'r', encoding='utf-8', errors='ignore') as f:
    frontend = f.read()

# Add handleDisconnect function
disconnect_func = """
  const handleDisconnect = async () => {
    try {
      await fetch('http://localhost:8000/api/meta/disconnect', { method: 'POST' });
      setIsMetaConnected(false);
    } catch (err) {
      console.error(err);
    }
  };
"""
if "handleDisconnect" not in frontend:
    frontend = frontend.replace('const handleConnect = async () => {', disconnect_func + '\n  const handleConnect = async () => {')

# Add Disconnect button to the UI when connected
frontend = frontend.replace(
    "{isMetaConnected ? 'Ready' : 'Unknown'}\n                </div>",
    "{isMetaConnected ? 'Ready' : 'Unknown'}\n                </div>\n                {isMetaConnected && (\n                  <button onClick={handleDisconnect} className=\"text-xs text-red-400 hover:text-red-300 underline ml-3 font-semibold mt-2\">\n                    Disconnect to test again\n                  </button>\n                )}"
)

with open(cb_path, 'w', encoding='utf-8') as f:
    f.write(frontend)
