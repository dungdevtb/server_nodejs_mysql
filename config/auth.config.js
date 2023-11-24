// module.exports = {
//   secret: "bezkoder-secret-key",
//   // jwtExpiration: 3600,         // 1 hour
//   // jwtRefreshExpiration: 86400, // 24 hours

//   /* for test */
//   SECRET: "SECRET_TOKEN",
//   SECRET_REFRESH: "SECRET_REFRESH_TOKEN",
//   tokenLife: 60, // 1 minute
//   refreshTokenLife: 120, // 2 minutes
// };


const config = Object.freeze({
  SECRET: "SECRET_TOKEN",
  SECRET_REFRESH: "SECRET_REFRESH_TOKEN",
  tokenLife: 60, // 1 minute
  refreshTokenLife: 120, // 2 minutes
})

module.exports = config