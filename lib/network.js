/*
Credits: Robin Allen
GitHub: https://github.com/robin-allen
Site: http://foon.uk
*/

var assign = function(a, b) {
  for(var key in b) {
    a[key] = b[key];
  }
  return a;
}

module.exports = function(w) {

  var log = { rq: null, requests: [] };
  var fakeResult = [];

  function FakeXHR() {

    var rq = log.rq = this;
    var queueIndex = 0;

    rq.sent = null;
    rq.headers = {};

    rq.onreadystatechange = function() {};

    rq.open = function(method, url, async) {
      rq.method = method;
      rq.url = url;
      rq.async = async;
      log.requests.push({
        method: method,
        url: url,
        async: async
      });
    };

    rq.setHeaders = function(headers) {
      rq.headers = headers;
    };

    rq.setRequestHeader = function(x, y) {
      rq.headers[x] = y;
    };

    rq.getAllResponseHeaders = function() {};

    rq.send = function(data) {
      rq.sent = data;

      rq.readyState = 4;

      if(fakeResult instanceof Array) {
        var filtered = fakeResult.filter(function(r) {
          if(!r.method) r.method = 'GET';
          return r.url === rq.url && r.method === rq.method;
        });
        if(filtered.length > 0) {
          assign(rq, filtered[0].response);
        } else {
          throw new Error('Missing mock for ' + rq.url + ' (method: ' + rq.method + ')');
        }
      } else if(typeof fakeResult === 'function') {
        assign(rq, fakeResult(rq));
      } else {
        assign(rq, fakeResult);
      };

      // making it close to the real http request
      setTimeout(function() {
        rq.onreadystatechange();
      }, 100);
    };

  }

  global.window = window = w || {};
  global.XMLHttpRequest = window.XMLHttpRequest = FakeXHR;

  return {
    getLog: function() {
      return log;
    },
    addMock: function(m) {
      if(m instanceof Array) {
        fakeResult = fakeResult.concat(m);
      } else if(typeof m === 'function') {
        fakeResult = m;
      } else {
        fakeResult.push(m);
      }
    },
    clearXHRMocks: function() {
      fakeResult = [];
    },
    getMocks: function() {
      return fakeResult;
    }
  };

};