// Static AIS normalization ranges for the marketing site calculator
// This replaces the database-driven ranges for the public-facing site

export const AIS_RANGES = {
  // Token dimension ranges
  token_volume: { min: 0, max: 100000 },
  token_peak: { min: 0, max: 50000 },
  token_io: { min: 0, max: 10000 },

  // Execution dimension ranges
  execution_iterations: { min: 1, max: 10 },
  execution_duration: { min: 0, max: 30000 },
  execution_failure: { min: 0, max: 1 },
  execution_retry: { min: 0, max: 1 },

  // Plugin dimension ranges
  plugin_count: { min: 0, max: 20 },
  plugin_usage: { min: 0, max: 1 },
  plugin_overhead: { min: 0, max: 5000 },

  // Workflow dimension ranges
  workflow_steps: { min: 1, max: 50 },
  workflow_branches: { min: 0, max: 10 },
  workflow_loops: { min: 0, max: 5 },
  workflow_parallel: { min: 0, max: 10 },
};

export const AIS_MODE = {
  active: 0, // 0 = Best Practice, 1 = Dynamic
  description: 'Best Practice'
};
