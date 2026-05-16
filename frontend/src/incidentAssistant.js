export const minimumIncidentTextLength = 20;

export const emptyIncidentAnalysis = {
  summary: '',
  severity: '',
  possibleRootCause: '',
  recommendedChecks: [],
  escalationMessage: '',
};

export function validateIncidentText(incidentText) {
  const normalizedText = typeof incidentText === 'string' ? incidentText.trim() : '';

  if (!normalizedText) {
    return 'Paste alert text or incident logs before running the analysis.';
  }

  if (normalizedText.length < minimumIncidentTextLength) {
    return `Add at least ${minimumIncidentTextLength} characters so the assistant has enough context.`;
  }

  return '';
}
