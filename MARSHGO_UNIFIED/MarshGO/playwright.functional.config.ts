import config from './playwright.config';

export default {
  ...config,
  projects: [{ name: 'functional-cross-repo', use: config.use }],
};
