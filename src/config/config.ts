/**
 * config/config.ts
 *
 * Central API configuration.
 * Set DEPLOYMENT = false for local dev, true for production.
 */

const CONFIG = {
  DEPLOYMENT: false, // ← flip to true before deploying

  LOCAL_API_URL: "http://localhost:81",
  PRODUCTION_API_URL: "https://api.pxc.in",

  get API_URL() {
    return this.DEPLOYMENT ? this.PRODUCTION_API_URL : this.LOCAL_API_URL;
  },

  API_TIMEOUT: 30000,

  APP_NAME: "Phoenix Contact Transition Portal",
  APP_VERSION: "1.0.0",
} as const;

export default CONFIG;
