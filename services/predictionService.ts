
import { WaterParameters, RiskAnalysis, WaterStatus } from '../types';

export const analyzeWaterQuality = (params: WaterParameters): RiskAnalysis => {
  const { ph, temp, turbidity, tds } = params;
  const issues: string[] = [];
  const diseases: string[] = [];
  let score = 0; // Higher = Higher Risk

  // 1. pH checks (Ideal: 6.5 - 8.5)
  if (ph < 6.5 || ph > 8.5) {
    score += 25;
    issues.push(ph < 6.5 ? "Acidic: Potential pipe corrosion & metal leaching" : "Alkaline: Risk of mineral scaling & skin irritation");
    if (ph < 6.0) diseases.push("Gastritis", "Metabolic Acidosis (indirect)");
  }

  // 2. Turbidity checks (Ideal: < 1 NTU, Acceptable: < 5 NTU)
  if (turbidity > 5) {
    score += 40;
    issues.push("High Bacterial Risk: Suspended solids harbor pathogens");
    diseases.push("Cholera", "Cryptosporidiosis", "Dysentery");
  } else if (turbidity > 1) {
    score += 10;
    issues.push("Moderate Turbidity: Reduced disinfection efficacy");
  }

  // 3. TDS checks (Ideal: < 300, Acceptable: < 600)
  if (tds > 1000) {
    score += 50;
    issues.push("Hazardous TDS: Excessive mineral concentration");
    diseases.push("Kidney Stones", "Gallstones", "Dehydration");
  } else if (tds > 600) {
    score += 30;
    issues.push("High Salinity: Potential mineral imbalance");
  }

  // 4. Temp checks (Risk of microbial growth)
  if (temp > 35) {
    score += 15;
    issues.push("Microbial Proliferation: Thermal pollution risks");
    diseases.push("Legionnaires' Disease (if aerosolized)", "Naegleria fowleri (if used for nasal rinse)");
  }

  let status: WaterStatus = 'SAFE';
  let riskLevel = 'Minimal';
  let recommendation = 'Water is safe for consumption and general utility.';

  // Determine Status
  if (score >= 80) {
    status = 'CRITICAL';
    riskLevel = 'Critical Hazard';
    recommendation = 'DO NOT CONSUME. Hazardous mineral/microbial concentration. Immediate remediation required.';
  } else if (score >= 50) {
    status = 'HIGH RISK';
    riskLevel = 'Elevated Danger';
    recommendation = 'Boil water thoroughly before use. High risk of waterborne illness.';
  } else if (score >= 20) {
    status = 'LOW RISK';
    riskLevel = 'Precautionary';
    recommendation = 'Safe for non-potable use. Monitor source for further fluctuation.';
  }

  // If SAFE, clear all disease risks
  const finalIssues = status === 'SAFE' ? ['No risk indicators detected'] : issues;
  const finalDiseases = status === 'SAFE' ? [] : [...new Set(diseases)];

  // Add diseases to the issues list if unsafe
  if (status !== 'SAFE' && finalDiseases.length > 0) {
    finalIssues.push(`Predicted Disease Risks: ${finalDiseases.join(", ")}`);
  }

  return {
    status,
    riskLevel,
    confidence: Math.min(98, 85 + (score / 10)),
    potentialIssues: finalIssues,
    recommendation: status === 'SAFE' ? 'Water quality is within safe limits for all public uses.' : recommendation
  };
};
