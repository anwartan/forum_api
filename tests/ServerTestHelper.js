/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');

const ServerTestHelper = {
  async getAccessToken() {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const accessToken = jwtTokenManager.createAccessToken({ username: 'anwar', id: 'user-123' });
    return accessToken;
  },
};

module.exports = ServerTestHelper;
