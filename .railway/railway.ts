import {
  defineRailway,
  github,
  preserve,
  project,
  service,
  volume,
} from "railway/iac";

// Last resort for a per-service CaC repo. Prefer one .railway file for the
// project and drop this if you later combine services into that file.
export const partial = "odysseus";

export default defineRailway(() => {
  const data = volume("odysseus-data", {
    region: "us-west2",
    sizeMB: 5000,
  });

  const web = service("odysseus", {
    source: github("mic2016z/pewdie_odysseus", { branch: "dev" }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
    },
    healthcheck: "/api/health",
    healthcheckTimeout: 300,
    deploy: {
      restartPolicyType: "ON_FAILURE",
      restartPolicyMaxRetries: 10,
    },
    variables: {
      ALLOWED_ORIGINS: preserve(),
      AUTH_ENABLED: preserve(),
      DATABASE_URL: preserve(),
      LOCALHOST_BYPASS: preserve(),
      ODYSSEUS_ADMIN_PASSWORD: preserve(),
      ODYSSEUS_ADMIN_USER: preserve(),
      ODYSSEUS_DATA_DIR: preserve(),
      OAUTH_REDIRECT_BASE_URL: preserve(),
      SECURE_COOKIES: preserve(),
    },
    volumeMounts: {
      "/app/data": data,
    },
  });

  return project("pewdie-odysseus", {
    resources: [data, web],
  });
});
