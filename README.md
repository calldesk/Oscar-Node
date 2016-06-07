Oscar's Nodejs client
==================

This is the Nodejs client for Oscar.

Install
-------

	npm install git+git://github.com/calldesk/Oscar-Node.git

Usage
-----

```js
var Oscar = require('oscar-node');
var scientist = new Oscar(process.env.OSCAR_KEY);
// ...
```
Read the [docs](http://oscar.calldesk.fr/documentation.html) and have a look at [exemple.js](https://github.com/calldesk/Oscar-Node/blob/master/example.js).

Note: this example assumes `OSCAR_KEY` is available (`$ export OSCAR_KEY=<your-api-key>`). See [getting-started](http://oscar.calldesk.fr/) to get one.
