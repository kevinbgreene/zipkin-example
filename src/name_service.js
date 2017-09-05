const express = require('express');
const app = express();

const fetch = require('node-fetch');
const wrapFetch = require('zipkin-instrumentation-fetch');

const { Tracer } = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require('zipkin-context-cls');
const ctxImpl = new CLSContext();
const recorder = require('./recorder');

const tracer = new Tracer({ ctxImpl, recorder });

const zipkinFetch = wrapFetch(fetch, {
  tracer,
  serviceName: 'name_service'
});

app.use(zipkinMiddleware({
  tracer,
  serviceName: 'name_service' // name of this application
}));

app.get('/', (req, res) => {
  Promise.all([
    zipkinFetch('http://localhost:8010'),
    zipkinFetch('http://localhost:8020')
  ])
  .then(([ first, last ]) => {
    return Promise.all([
      first.text(),
      last.text()
    ]);  
  })
  .then(([ first, last ]) => {
    res.send(`${first} ${last}`);
  })
  .catch(err => res.sendStatus(500));
});


const server = app.listen(8000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Name service listening at http://%s:%s', host, port);
});
