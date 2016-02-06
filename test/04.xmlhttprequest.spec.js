var assert = require('assert');
suite('XMLHTTPRequest', function() {

  test('faking HTTP request', function(done) {
    var mockups = { 
      url: '/api/method/action',
      response: {
        status: 200,
        responseText: JSON.stringify({"id": "AAA"})
      }
    };
    var atomus = require('../lib');
    var b = atomus()
    .external(__dirname + '/data/ajaxwrapper.js')
    .ready(function(errors, window) {
      b.addXHRMock(mockups)
      window.AjaxWrapper().request({
        url: '/api/method/action',
        json: true
      }).done(function(result) {
        assert(result.id, 'AAA');
        done();
      })
    });
  });

  test('faking HTTP request and make difference between GET and POST', function(done) {
    var mockups = [
      { 
        url: '/api/method/action',
        response: {
          status: 200,
          responseText: JSON.stringify({"id": "AAA"})
        }
      },
      { 
        url: '/api/method/action',
        method: 'POST',
        response: {
          status: 200,
          responseText: JSON.stringify({"success": "OK"})
        }
      }
    ];
    var atomus = require('../lib');
    var b = atomus()
    .external(__dirname + '/data/ajaxwrapper.js')
    .ready(function(errors, window) {      
      b.addXHRMock(mockups)
      window.AjaxWrapper().request({
        url: '/api/method/action',
        json: true
      }).done(function(result) {
        assert(result.id, 'AAA');
        
        var log = b.network.getLog();
        window.AjaxWrapper().request({
          url: '/api/method/action',
          json: true,
          method: 'POST'
        }).done(function(result) {
          assert(result.success, 'OK');
          assert.deepEqual(log.requests,
            [
              { method: 'GET', url: '/api/method/action', async: true },
              { method: 'POST', url: '/api/method/action', async: true }
            ]
          );
          done();
        });

      });
    });
  });

  test('Runtime XHR mock', function(done) {
    // var mockups = { 
    //   url: '/api/method/action',
    //   response: {
    //     status: 200,
    //     responseText: JSON.stringify({"id": "AAA"})
    //   }
    // };
    var mock = function(params) {
      if(params.url === '/api/method/action' && params.method === 'GET') {
      return {
          status: 200,
          responseText: JSON.stringify({"id": "AAA"})
        }
      }
    };
    var atomus = require('../lib');
    var b = atomus()
    .external(__dirname + '/data/ajaxwrapper.js')
    .ready(function(errors, window) {
      b.addXHRMock(mock)
      window.AjaxWrapper().request({
        url: '/api/method/action',
        json: true
      }).done(function(result) {
        assert(result.id, 'AAA');
        done();
      })
    });
  });

});