const fork = require('child_process').fork;

fork('./src/name_service.js');
fork('./src/first_name_service.js');
fork('./src/last_name_service.js');