export const pipelineStages = [
  { label: 'Install', detail: 'Restore frontend and backend dependencies' },
  { label: 'Test', detail: 'Run API and UI smoke tests before build' },
  { label: 'Build', detail: 'Compile the Vite dashboard for production' },
  { label: 'Docker', detail: 'Build separate runtime images for each service' },
  { label: 'Deploy', detail: 'Simulate EC2 deployment for portfolio safety' },
];

export const technologies = [
  'React',
  'Vite',
  'Express.js',
  'Docker',
  'Jenkins',
  'Terraform',
  'AWS EC2',
];

