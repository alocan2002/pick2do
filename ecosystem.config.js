module.exports = {
  apps: [
    {
      name: "pick2do",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
