const WebSocket = require('ws');

const socket = new WebSocket("wss://lore-api.onrender.com/");

socket.on("open", () => {
  console.log("✅ Connected to Lore API WebSocket");
});

socket.on("message", (raw) => {
  const data = JSON.parse(raw);
  if (data.type === "token_update") {
    const token = data.data;

    const comp = token.narrativeAnalysis?.comprehensive || {};
    const bundle = token.bundleAnalysis?.bundlePatterns?.[0] || {};

    const extracted = {
      address: token.address,
      name: token.name,
      imageDescription: token.imageDescription,
      imageReferences: token.imageAnalysis?.references || [],
      fullAnalysis: comp.fullAnalysis || "",
      shortSummary: comp.shortSummary || "",
      threeWords: comp.threeWords || [],
      analysisTimestamp: token.narrativeAnalysis?.timestamp || null,
      bundleAnalysis: {
        holderCount: token.bundleAnalysis?.holderCount || 0,
        isValid: token.bundleAnalysis?.isValid || false,
        totalPercentage: bundle.totalPercentage || 0,
        avgPercentage: bundle.avgPercentage || 0,
        avgGap: bundle.avgGap || 0,
        gapStd: bundle.gapStd || 0,
        percentageRange: bundle.percentageRange || [],
        percentages: bundle.percentages || [],
        addresses: bundle.addresses || []
      },
      riskAssessment: {
        isHighRisk: token.isHighRisk ?? null,
        riskScore: token.riskScore ?? null,
        smartWallets: token.smartWallets || []
      }
    };

    console.log("📦 Token Extracted Data:\n", extracted);
  }
});

socket.on("close", () => {
  console.log("❌ Disconnected from Lore API");
});

socket.on("error", (err) => {
  console.error("WebSocket error:", err.message);
});
