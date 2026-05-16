const MIN_INCIDENT_TEXT_LENGTH = 20;

function normalizeIncidentText(incidentText) {
  return incidentText.trim().replace(/\s+/g, ' ');
}

function summarizeIncident(normalizedText) {
  const firstSentence = normalizedText.split(/[.!?]\s/)[0];
  const summary = firstSentence.length > 140 ? `${firstSentence.slice(0, 137)}...` : firstSentence;

  return `Incident signal detected: ${summary}`;
}

function classifySeverity(lowercaseText) {
  if (
    /critical|sev1|sev-1|outage|down|unavailable|customer impact|all users|data loss/.test(
      lowercaseText,
    )
  ) {
    return 'Critical';
  }

  if (/5xx|error rate|latency|timeout|pod crash|crashloop|auth failure|failed health/.test(lowercaseText)) {
    return 'High';
  }

  if (/warning|degraded|retry|cpu|memory|disk|queue|slow/.test(lowercaseText)) {
    return 'Medium';
  }

  return 'Low';
}

function inferRootCause(lowercaseText) {
  if (/database|db|connection pool|postgres|mysql|rds/.test(lowercaseText)) {
    return 'Database connectivity or connection pool saturation may be affecting application responses.';
  }

  if (/cpu|memory|disk|node pressure|resource/.test(lowercaseText)) {
    return 'Resource pressure on the host or container may be causing degraded service behavior.';
  }

  if (/deploy|release|rollback|version|image/.test(lowercaseText)) {
    return 'A recent deployment or runtime image change may have introduced the incident.';
  }

  if (/network|dns|load balancer|elb|alb|security group/.test(lowercaseText)) {
    return 'Network routing, DNS, load balancer, or security group configuration may be blocking traffic.';
  }

  if (/auth|token|certificate|tls|ssl|permission/.test(lowercaseText)) {
    return 'Authentication, certificate, or permission configuration may be failing.';
  }

  return 'The alert needs correlation with recent deployments, infrastructure metrics, and service logs.';
}

function buildRecommendedChecks(lowercaseText) {
  const checks = [
    'Check service health endpoints and confirm the scope of impacted users.',
    'Review recent Jenkins deployments, image tags, and configuration changes.',
    'Inspect container logs and host metrics for errors, saturation, or restarts.',
  ];

  if (/database|db|postgres|mysql|rds/.test(lowercaseText)) {
    checks.push('Validate database connectivity, slow queries, and connection pool usage.');
  }

  if (/network|dns|load balancer|elb|alb|security group/.test(lowercaseText)) {
    checks.push('Verify DNS resolution, load balancer target health, and security group rules.');
  }

  if (/cpu|memory|disk|resource/.test(lowercaseText)) {
    checks.push('Review CPU, memory, disk, and container restart metrics for capacity pressure.');
  }

  return checks.slice(0, 5);
}

export function validateIncidentText(incidentText) {
  if (typeof incidentText !== 'string' || incidentText.trim().length === 0) {
    return 'incidentText is required.';
  }

  if (incidentText.trim().length < MIN_INCIDENT_TEXT_LENGTH) {
    return `incidentText must be at least ${MIN_INCIDENT_TEXT_LENGTH} characters.`;
  }

  return '';
}

export function analyzeIncident(incidentText) {
  const validationError = validateIncidentText(incidentText);
  if (validationError) {
    throw new Error(validationError);
  }

  const normalizedText = normalizeIncidentText(incidentText);
  const lowercaseText = normalizedText.toLowerCase();
  const severity = classifySeverity(lowercaseText);

  return {
    summary: summarizeIncident(normalizedText),
    severity,
    possibleRootCause: inferRootCause(lowercaseText),
    recommendedChecks: buildRecommendedChecks(lowercaseText),
    escalationMessage: `NOC escalation (${severity}): Review the incident context, validate current impact, and notify the on-call DevOps owner with logs, metrics, and recent deployment details.`,
  };
}
