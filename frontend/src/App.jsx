import { useEffect, useState } from 'react';
import { pipelineStages, technologies } from './content.js';
import {
  emptyIncidentAnalysis,
  validateIncidentText,
} from './incidentAssistant.js';
import { analyzeIncident, getHealthStatus, getPortfolioMessage } from './services/api.js';
import './styles.css';

const initialState = {
  loading: true,
  error: '',
  health: null,
  message: null,
};

const initialIncidentState = {
  incidentText: '',
  loading: false,
  error: '',
  analysis: emptyIncidentAnalysis,
};

export default function App() {
  const [apiState, setApiState] = useState(initialState);
  const [incidentState, setIncidentState] = useState(initialIncidentState);

  useEffect(() => {
    let mounted = true;

    async function loadApiStatus() {
      try {
        const [health, message] = await Promise.all([getHealthStatus(), getPortfolioMessage()]);
        if (mounted) {
          setApiState({ loading: false, error: '', health, message });
        }
      } catch (error) {
        if (mounted) {
          setApiState({ loading: false, error: error.message, health: null, message: null });
        }
      }
    }

    loadApiStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const statusLabel = apiState.loading
    ? 'Checking API'
    : apiState.error
      ? 'API unavailable'
      : 'API connected';

  async function handleIncidentSubmit(event) {
    event.preventDefault();

    const validationError = validateIncidentText(incidentState.incidentText);
    if (validationError) {
      setIncidentState((currentState) => ({
        ...currentState,
        error: validationError,
        analysis: emptyIncidentAnalysis,
      }));
      return;
    }

    setIncidentState((currentState) => ({ ...currentState, loading: true, error: '' }));

    try {
      const analysis = await analyzeIncident(incidentState.incidentText);
      setIncidentState((currentState) => ({
        ...currentState,
        loading: false,
        error: '',
        analysis,
      }));
    } catch (error) {
      setIncidentState((currentState) => ({
        ...currentState,
        loading: false,
        error: error.message,
        analysis: emptyIncidentAnalysis,
      }));
    }
  }

  function handleIncidentTextChange(event) {
    setIncidentState((currentState) => ({
      ...currentState,
      incidentText: event.target.value,
      error: '',
    }));
  }

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Junior DevOps portfolio project</p>
          <h1 id="page-title">DevSecOps CI/CD dashboard for cloud deployment practice.</h1>
          <p className="lede">
            A recruiter-friendly full-stack project showing networking awareness, container
            workflows, Jenkins automation, and Terraform-based AWS EC2 infrastructure.
          </p>
          <div className="tech-list" aria-label="Technologies used">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>

        <div className="status-panel" aria-live="polite">
          <span className={apiState.error ? 'status-dot status-dot--error' : 'status-dot'} />
          <div>
            <strong>{statusLabel}</strong>
            <p>
              {apiState.loading && 'Waiting for /api/health...'}
              {apiState.error && apiState.error}
              {apiState.health &&
                `${apiState.health.service} is ${apiState.health.status} in ${apiState.health.environment}.`}
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="DevSecOps project dashboard">
        <article className="dashboard-card dashboard-card--wide">
          <div className="card-heading">
            <span>Pipeline</span>
            <strong>Jenkins CI/CD</strong>
          </div>
          <ol className="pipeline-list">
            {pipelineStages.map((stage) => (
              <li key={stage.label}>
                <strong>{stage.label}</strong>
                <p>{stage.detail}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <span>API response</span>
            <strong>Express backend</strong>
          </div>
          <p className="message-text">
            {apiState.message?.message || 'Run the backend to load the portfolio API message.'}
          </p>
        </article>

        <article className="dashboard-card">
          <div className="card-heading">
            <span>Infrastructure</span>
            <strong>AWS EC2</strong>
          </div>
          <p>
            Terraform defines an EC2 instance, security group ingress, variables, outputs, and
            bootstrap user data for Docker.
          </p>
        </article>
      </section>

      <section className="incident-assistant" aria-labelledby="incident-assistant-title">
        <div className="assistant-intro">
          <p className="eyebrow">AI automation workflow</p>
          <h2 id="incident-assistant-title">AI Incident Assistant</h2>
          <p>
            Structured triage output for NOC alerts, service logs, deployment incidents, and
            first-response escalation.
          </p>
        </div>

        <form className="assistant-form" onSubmit={handleIncidentSubmit}>
          <label htmlFor="incident-text">Incident logs or alert text</label>
          <textarea
            id="incident-text"
            value={incidentState.incidentText}
            onChange={handleIncidentTextChange}
            placeholder="Example: Critical outage detected. Checkout API returns 5xx errors after the latest deployment, with elevated latency and failed health checks."
            rows={7}
          />
          <div className="assistant-actions">
            <button type="submit" disabled={incidentState.loading}>
              {incidentState.loading ? 'Analyzing...' : 'Analyze Incident'}
            </button>
            {incidentState.error && <p role="alert">{incidentState.error}</p>}
          </div>
        </form>

        <div className="analysis-grid" aria-live="polite">
          <article className="analysis-card">
            <span>Summary</span>
            <p>{incidentState.analysis.summary || 'Analysis summary will appear here.'}</p>
          </article>
          <article className="analysis-card">
            <span>Severity</span>
            <strong className={`severity severity--${incidentState.analysis.severity || 'pending'}`}>
              {incidentState.analysis.severity || 'Pending'}
            </strong>
          </article>
          <article className="analysis-card">
            <span>Possible Root Cause</span>
            <p>
              {incidentState.analysis.possibleRootCause ||
                'Potential root cause guidance will appear after analysis.'}
            </p>
          </article>
          <article className="analysis-card analysis-card--wide">
            <span>Recommended Checks</span>
            {incidentState.analysis.recommendedChecks.length > 0 ? (
              <ul>
                {incidentState.analysis.recommendedChecks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            ) : (
              <p>Operational checks will appear after analysis.</p>
            )}
          </article>
          <article className="analysis-card analysis-card--wide">
            <span>Escalation Message</span>
            <p>
              {incidentState.analysis.escalationMessage ||
                'A ready-to-send escalation note will appear after analysis.'}
            </p>
          </article>
        </div>
      </section>

      <section className="feature-grid" aria-label="Included project pieces">
        <article>
          <span>01</span>
          <h2>Frontend</h2>
          <p>Vite React dashboard with API status and portfolio-focused project signals.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Backend</h2>
          <p>Express API with environment configuration, security middleware, and tests.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Containers</h2>
          <p>Separate service Dockerfiles and Compose wiring for local integration checks.</p>
        </article>
        <article>
          <span>04</span>
          <h2>DevSecOps</h2>
          <p>Security group rules, health checks, CI stages, and deploy simulation included.</p>
        </article>
        <article>
          <span>05</span>
          <h2>AI Ops</h2>
          <p>Mock incident assistant workflow prepared for future OpenAI API integration.</p>
        </article>
      </section>
    </main>
  );
}
