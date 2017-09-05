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
  serviceName: 'last_name_service' // name of this application
}));

app.get('/', (req, res) => {
  console.log('req: last_name_service:', req.headers);
  res.send('Flanders');
});


const server = app.listen(8020, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Last name service listening at http://%s:%s', host, port);
});
