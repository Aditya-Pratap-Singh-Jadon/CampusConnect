const dns = require('node:dns');
const { isIP } = require('node:net');

module.exports = function configureMongoDns() {
  const server = process.env.MONGO_DNS_SERVER;
  if (!server) return;
  if (!isIP(server)) throw new Error('MONGO_DNS_SERVER must be an IPv4 or IPv6 address.');
  dns.setServers([server]);
};
