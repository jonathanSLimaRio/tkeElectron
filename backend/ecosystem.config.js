module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/index.js",
      args: "run start:prod",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
