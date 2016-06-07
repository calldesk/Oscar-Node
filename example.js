'use strict';
let Oscar = require('./oscar');

var scientist = new Oscar('lMVpBBTx2HOJzYiLsZaqBTuAyGgr6KtpGoZ1ILOBag9zfnNlbnNvdXQtb3NjYXJyEQsSBFVzZXIYgICAgICAgAoM');

var experiment = {name: 'Test', parameters: {x: {min: -10, max: 10}}};
var max = 10;
var count = 0;

function _next () {
  scientist.suggest(experiment, function (err, job) {
    if (err) throw err;
    // Run you complex, time-consuming algorithm
    var loss = Math.pow(job.x, 2);
    // Tell Oscar the result
    scientist.update(job, {loss: loss}, function (err) {
      if (err) throw err;
      if (++count < max) {
        _next();
      }
    });
  });
}

_next();
