'use strict';
let request = require('request');
let querystring = require('querystring');

const _API_VERSION = '1';
const _DOMAIN_URL = 'https://' + _API_VERSION + '-dot-sensout-oscar.appspot.com';

class Oscar {

  constructor (token) {
    this._token = token;
    this._trialIds = {};
    this._trialKeys = {};
  }

  /**
   * Generic GET API call.
   * @private
   */
  _request (url, params, callback) {
    request.get(
      {
        url: _DOMAIN_URL + url + '?' + querystring.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this._token
        }
      },
      function (err, res, body) {
        if (err) {
          callback(err);
        } else {
          // TODO handle JSON parsing error
          var data = null;
          try {
            data = JSON.parse(body);
          } catch (e) {
            callback(e);
          }
          if (data) {
            if (data.redirect) {
              callback(new Error('Your are not authenticated. You should try updating your access token.'));
            } else {
              callback(null, data);
            }
          }
        }
      }).on('error', function (e) {
        callback(e);
      });
  }

  /**
   * Compute hash for a given job.
   * @private
   */
  _getJobHash (job) {
    return JSON.stringify(job);
  }

  /**
   * Return job id for a given job.
   * @private
   */
  _getJobId (job) {
    return this._trialsIds[this._getJobHash(job)];
  }

  /**
   * Suggest new hyper parameters to try.
   */
  suggest (experiment, callback) {
    var that = this;
    this._request(
      '/suggest',
      { 'experiment': JSON.stringify(experiment) },
      function (err, result) {
        if (err) {
          callback(err);
        } else {
          if (result.job && result.trial_key && result.trial_id !== null) {
            var hash = that._getJobHash(result.job);
            that._trialIds[hash] = result.trial_id;
            that._trialKeys[hash] = result.trial_key;
            callback(null, result.job);
          } else {
            callback(new Error('No job returned. Check your parameters and quotas ' + JSON.stringify(result)));
          }
        }
      }
    );
  }

  /**
   * Update result for an experiment.
   */
  update (job, result, callback) {
    this._request(
      '/update',
      {
        'trial_key': this._trialKeys[this._getJobHash(job)],
        'result': JSON.stringify(result)
      },
      callback
    );
  }
}

module.exports = Oscar;
