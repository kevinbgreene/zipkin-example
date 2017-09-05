const express = require('express');
const app = express();
const { Tracer } = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require('zipkin-context-cls');
const recorder = require('./recorder');

const ctxImpl = new CLSContext();
const tracer = new Tracer({ ctxImpl, recorder });

app.use(zipkinMiddleware({
  tracer,
  serviceName: 'first_name_service' // name of this application
}));

app.get('/', (req, res) => {
  res.send('Ned');
});

const server = app.listen(8010, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('First name service listening at http://%s:%s', host, port);
});
