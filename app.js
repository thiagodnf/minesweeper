const connect = require('connect');
    serveStatic = require('serve-static');
    packageJson = require("./package.json")
	port = process.env.PORT || 3000;

connect().use(serveStatic(__dirname)).listen(port);

console.log(`Running ${packageJson.name}`);
console.log('The magic happens at http://localhost:' + port);
