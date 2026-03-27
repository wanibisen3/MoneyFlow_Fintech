import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { parse } from "csv-parse/sync";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

interface Transaction {
  transaction_id: string;
  date: string;
  source_currency: string;
  source_amount: string;
  target_currency: string;
  target_amount: string;
  fx_rate_applied: string;
  reference_fx_rate: string;
  provider: string;
  flow_type: string;
  route: string;
  entity: string;
}

function analyzeTransactions(transactions: Transaction[]) {
  const issues: any[] = [];
  const recommendations: any[] = [];
  let totalVolume = 0;
  let totalInefficiency = 0;
  
  const fromCountry = "Singapore"; // Assuming SGD source
  const toCountry = transactions[0]?.target_currency === "IDR" ? "Indonesia" : 
                    transactions[0]?.target_currency === "MYR" ? "Malaysia" : "Thailand";

  // Rule 1: Double Conversion
  const doubleConvTxns = transactions.filter(t => t.route.split("→").length >= 3);
  if (doubleConvTxns.length > 0) {
    const loss = doubleConvTxns.reduce((acc, t) => acc + parseFloat(t.source_amount) * 0.018, 0);
    issues.push({
      id: "double_conv",
      title: "Double Conversion Detected",
      description: `${doubleConvTxns.length} transactions are routing through USD (e.g. SGD→USD→IDR), causing ~1.8% additional slippage.`,
      severity: "critical",
      estLoss: Math.round(loss)
    });
    recommendations.push({
      title: "Enable Direct Corridors",
      description: "Switch to providers that support direct SGD→IDR/MYR settlement to bypass USD intermediary hops.",
      estimatedSavings: Math.round(loss * 0.8),
      provider: "Airwallex"
    });
  }

  // Rule 2: FX Inefficiency
  const inefficientTxns = transactions.filter(t => {
    const applied = parseFloat(t.fx_rate_applied);
    const ref = parseFloat(t.reference_fx_rate);
    return (ref - applied) / ref > 0.015; // > 1.5% spread
  });
  if (inefficientTxns.length > 0) {
    const loss = inefficientTxns.reduce((acc, t) => {
      const ref = parseFloat(t.reference_fx_rate);
      const applied = parseFloat(t.fx_rate_applied);
      return acc + (parseFloat(t.source_amount) * (ref - applied) / ref);
    }, 0);
    issues.push({
      id: "fx_inefficiency",
      title: "High FX Spread",
      description: `Detected spreads >1.5% on ${inefficientTxns.length} transactions compared to mid-market rates.`,
      severity: "high",
      estLoss: Math.round(loss)
    });
  }

  // Rule 3: Provider Misuse (Stripe for Payouts)
  const stripePayouts = transactions.filter(t => t.provider.toLowerCase() === "stripe" && t.flow_type.includes("payout"));
  if (stripePayouts.length > 0) {
    issues.push({
      id: "provider_misuse",
      title: "Provider Misuse (Stripe)",
      description: "Using Stripe (optimized for collection) for high-volume payouts. Stripe FX markups are typically 1-2% higher than treasury-first providers.",
      severity: "medium",
      estLoss: Math.round(stripePayouts.length * 150) // Mock loss per txn
    });
    recommendations.push({
      title: "Offload Payouts to Wise/Airwallex",
      description: "Keep Stripe for card collections but use a dedicated payout provider for supplier and contractor payments.",
      estimatedSavings: Math.round(stripePayouts.length * 120),
      provider: "Wise"
    });
  }

  // Rule 4: Missing Local Rails
  const missingLocalRails = transactions.filter(t => t.target_currency === "IDR" && !["airwallex", "wise"].includes(t.provider.toLowerCase()));
  if (missingLocalRails.length > 0) {
    issues.push({
      id: "missing_local_rails",
      title: "Missing Local Rails (Indonesia)",
      description: "Transactions to Indonesia are not using local rails (GoPay, OVO, DANA), leading to higher failure rates and costs.",
      severity: "medium",
      estLoss: Math.round(missingLocalRails.length * 80)
    });
  }

  // Rule 5: Entity Routing Mismatch
  const entities = Array.from(new Set(transactions.map(t => t.entity)));
  const corridors = Array.from(new Set(transactions.map(t => `${t.source_currency}→${t.target_currency}`)));
  let mismatchFound = false;
  corridors.forEach(corridor => {
    const providersForCorridor = new Set(transactions.filter(t => `${t.source_currency}→${t.target_currency}` === corridor).map(t => t.provider));
    if (providersForCorridor.size > 1) mismatchFound = true;
  });
  if (mismatchFound) {
    issues.push({
      id: "entity_mismatch",
      title: "Entity Routing Mismatch",
      description: "Different legal entities are using different providers for the same corridors, preventing volume-based fee tiering.",
      severity: "low",
      estLoss: 1200
    });
  }

  totalVolume = transactions.reduce((acc, t) => acc + parseFloat(t.source_amount), 0);
  totalInefficiency = issues.reduce((acc, i) => acc + i.estLoss, 0);

  return {
    fromCountry,
    toCountry,
    heroInsight: {
      headline: "Cross-Border Capital Velocity Analysis",
      subheadline: `Analysis of ${transactions.length} transactions reveals structural friction in your ${fromCountry} → ${toCountry} corridors.`
    },
    summary: {
      totalVolume,
      totalInefficiency,
      avgInefficiencyPct: parseFloat(((totalInefficiency / totalVolume) * 100).toFixed(2)),
      largestIssue: issues[0]?.title || "None",
      activeFlows: transactions.length,
      potentialSavings: recommendations.reduce((acc, r) => acc + r.estimatedSavings, 0)
    },
    moneyJourney: [
      { type: "country", label: "Origin", value: fromCountry, isInefficient: false },
      { type: "provider", label: "Collection", value: "Stripe", isInefficient: stripePayouts.length > 0 },
      { type: "provider", label: "FX Optimization", value: "Wise", isInefficient: doubleConvTxns.length > 0, issue: "Double Conversion" },
      { type: "provider", label: "Local Rails", value: "Airwallex", isInefficient: missingLocalRails.length > 0 },
      { type: "country", label: "Destination", value: toCountry, isInefficient: false }
    ],
    issues,
    recommendations,
    optimizedFlows: [
      {
        name: "Optimized Treasury Route",
        steps: [
          { type: "country", value: fromCountry },
          { type: "provider", value: "Stripe" },
          { type: "provider", value: "Wise" },
          { type: "provider", value: "Airwallex" },
          { type: "country", value: toCountry }
        ],
        benefit: "Eliminates double conversion and leverages local rails",
        estimatedSavings: recommendations.reduce((acc, r) => acc + r.estimatedSavings, 0)
      }
    ],
    breakdowns: {
      byProvider: Array.from(new Set(transactions.map(t => t.provider))).map(p => ({
        provider: p,
        value: Math.round((transactions.filter(t => t.provider === p).length / transactions.length) * 100)
      })),
      byRoute: Array.from(new Set(transactions.map(t => t.route))).map(r => ({
        route: r,
        value: Math.round((transactions.filter(t => t.route === r).length / transactions.length) * 100)
      })),
      byFlowType: Array.from(new Set(transactions.map(t => t.flow_type))).map(f => ({
        flow_type: f,
        value: Math.round((transactions.filter(t => t.flow_type === f).length / transactions.length) * 100)
      })),
      byEntity: Array.from(new Set(transactions.map(t => t.entity))).map(e => ({
        entity: e,
        value: Math.round((transactions.filter(t => t.entity === e).length / transactions.length) * 100)
      }))
    },
    metadata: {
      fromCountry,
      toCountry,
      currency: transactions[0]?.source_currency || "SGD"
    }
  };
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging middleware for debugging Vercel routing
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/ping", (req, res) => {
  res.json({ status: "pong", timestamp: new Date().toISOString() });
});

// API Endpoints directly on the app to avoid router mounting issues
app.get("/api/analysis", (req, res) => {
  console.log("[DEBUG] GET /api/analysis");
  const sampleCsvPath = path.join(process.cwd(), "api", "sample_transactions.csv");
  console.log(`[DEBUG] Sample CSV Path: ${sampleCsvPath}`);
  if (!fs.existsSync(sampleCsvPath)) {
    console.error(`[ERROR] Sample CSV NOT FOUND at ${sampleCsvPath}`);
    return res.status(500).json({ error: "Sample data file not found" });
  }
  const sampleCsv = fs.readFileSync(sampleCsvPath, "utf-8");
  const transactions = parse(sampleCsv, { columns: true, skip_empty_lines: true }) as Transaction[];
  res.json(analyzeTransactions(transactions));
});

app.get("/api/sample-data", (req, res) => {
  const { fromCountry, toCountry } = req.query;
  console.log(`[DEBUG] GET /api/sample-data: from=${fromCountry}, to=${toCountry}`);
  const sampleCsvPath = path.join(process.cwd(), "api", "sample_transactions.csv");
  console.log(`[DEBUG] Sample CSV Path: ${sampleCsvPath}`);
  if (!fs.existsSync(sampleCsvPath)) {
    console.error(`[ERROR] Sample CSV NOT FOUND at ${sampleCsvPath}`);
    return res.status(500).json({ error: "Sample data file not found" });
  }
  const sampleCsv = fs.readFileSync(sampleCsvPath, "utf-8");
  const transactions = parse(sampleCsv, { columns: true, skip_empty_lines: true }) as Transaction[];
  res.json(analyzeTransactions(transactions));
});

app.post("/api/analyze", upload.single('file'), (req, res) => {
  console.log("[DEBUG] POST /api/analyze");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  try {
    const csvContent = req.file.buffer.toString("utf-8");
    const transactions = parse(csvContent, { columns: true, skip_empty_lines: true }) as Transaction[];
    
    console.log(`[DEBUG] Analyzing file: ${req.file.originalname}, rows: ${transactions.length}`);
    
    setTimeout(() => {
      res.json(analyzeTransactions(transactions));
    }, 1500);
  } catch (error: any) {
    console.error("[ERROR] Analysis error:", error);
    res.status(500).json({ error: "Failed to parse CSV: " + error.message });
  }
});

// Catch-all for everything else to help debugging
app.use((req, res, next) => {
  // If it's an API route that wasn't caught, return JSON 404
  if (req.url.startsWith("/api")) {
    console.log(`[DEBUG] 404 API Catch-all: ${req.method} ${req.url}`);
    return res.status(404).json({ 
      error: `API Route not found: ${req.method} ${req.url}`,
      hint: "If you see this, the request reached the Express server but didn't match any /api routes.",
      url: req.url,
      method: req.method
    });
  }
  next();
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[DEBUG] Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
