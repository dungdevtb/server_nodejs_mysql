const config = Object.freeze({
  SECRET: "SECRET_TOKEN",
  SECRET_REFRESH: "SECRET_REFRESH_TOKEN",
  tokenLife: 3600,         // 1 hour
  refreshTokenLife: 86400, // 24 hours
})

module.exports = config