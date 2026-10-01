async function testBrain() {
  console.log("Sending a test campaign to the Brain backend...");
  try {
    const payload = {
      type: "standard",
      name: "Test Brain Campaign",
      goal: "Traffic",
      budget: 15,
      target_location: "Mumbai, India",
      target_age: "18 - 35",
      target_audience: "People interested in AI marketing tools",
      website_url: "https://metaadsbrain.com"
    };

    const response = await globalThis.fetch('http://localhost:5000/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed!", response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log("Success! Campaign ID:", data.id);
    console.log("========================================");
    console.log("GENERATED AI STRATEGY (Preview):");
    console.log("========================================");
    console.log(data.strategy.substring(0, 1000) + "...\n(Truncated for preview)");
    
  } catch (err) {
    console.error("Error during test:", err.message);
  }
}

testBrain();
