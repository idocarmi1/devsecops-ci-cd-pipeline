import { useEffect, useState } from 'react';
import { pipelineStages, technologies } from './content.js';
import { getHealthStatus, getPortfolioMessage } from './services/api.js';
import './styles.css';

const initialState = {
  loading: true,
  error: '',
  health: null,
  message: null,
};

export default function App() {
  const [apiState, setApiState] = useState(initialState);

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
      </section>
    </main>
  );
}
