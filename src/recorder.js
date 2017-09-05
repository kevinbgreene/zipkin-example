const { BatchRecorder } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');

module.exports = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: `http://localhost:9411/api/v1/spans`
  })
});