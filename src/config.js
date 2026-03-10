export const APP_CONFIG = {
  agentEmail: "applications@rentalportal.co.za",
  rentToIncomeThresholds: {
    pass: 0.30,
    borderline: 0.35
  },
  secondApplicant: {
    allowed: true,
    requiredForProperties: ["prop-001"] // High-end properties might require two incomes
  },
  uploadLimits: {
    maxSizeMB: 10,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"]
  }
};
