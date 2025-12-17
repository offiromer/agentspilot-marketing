// Static pricing configuration for the marketing site calculator
// This replaces the database-driven configuration for the public-facing site

export const PRICING_CONFIG = {
  // Calculator estimation formulas
  calculatorEstimation: {
    baseTokens: 1000,
    tokensPerPlugin: 500,
    peakMultiplier: 1.5,
    baseIterations: 2,
    maxIterations: 5,
    pluginUsageRate: 0.8,
    orchestrationOverheadMs: 100,
    estimatedDurationMs: 2000,
    estimatedFailureRate: 0.05,
    estimatedRetryRate: 0.1,
    ioRatio: 0.3,
  },

  // AIS dimension weights
  aisWeights: {
    tokens: 0.35,
    execution: 0.25,
    plugins: 0.25,
    workflow: 0.15,
  },

  // AIS sub-dimension weights
  aisSubWeights: {
    token: {
      volume: 0.5,
      peak: 0.3,
      io: 0.2,
    },
    execution: {
      iterations: 0.35,
      duration: 0.30,
      failure: 0.20,
      retry: 0.15,
    },
    plugin: {
      count: 0.4,
      usage: 0.35,
      overhead: 0.25,
    },
    workflow: {
      steps: 0.4,
      branches: 0.25,
      loops: 0.20,
      parallel: 0.15,
    },
  },

  // Alternative naming for frontend compatibility
  tokenSubWeights: {
    volume: 0.5,
    peak: 0.3,
    io: 0.2,
  },
  executionSubWeights: {
    iterations: 0.35,
    duration: 0.30,
    failure: 0.20,
    retry: 0.15,
  },
  pluginSubWeights: {
    count: 0.4,
    usage: 0.35,
    overhead: 0.25,
  },
  workflowSubWeights: {
    steps: 0.4,
    branches: 0.25,
    loops: 0.20,
    parallel: 0.15,
  },

  // System limits
  minAgentIntensity: 0.0,
  maxAgentIntensity: 10.0,
  minExecutionsForScore: 5,

  // Pricing parameters
  baseCreditsPerRun: 100,
  pluginOverheadPerRun: 50,
  systemOverheadPerRun: 20,
  runsPerAgentPerMonth: 100,
  creditCostUsd: 0.001, // $0.001 per credit
  minimumMonthlyCostUsd: 10,
  agentCreationCost: 0,
  executionStepMultiplier: 1.2,
  freeTierCredits: 10417,

  // Empty arrays for backward compatibility
  aisTiers: [],
  executionStepsByPlugins: []
};
