module.exports = {
  browser: function(ops) {

    if(!ops) ops = {};

    // defaults
    var options = {
      html: ops.html || '<!doctype html><html><head></head><body></body></html>',
      scripts: ops.scripts || []
    };
    var api = {}, readyCallback;

    var process = function() {
      var jsdom = require("jsdom");
      jsdom.env({
        html: options.html,
        scripts: options.scripts,
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"],
        },
        done: function(errors, window) {
          api.window = window;
          api.$ = function(selector) {
            return window.document.querySelector(selector);
          };
          api.trigger = function(element, event) {
            var e = window.document.createEvent('UIEvents');
            e.initEvent(event, true, true);
            element.dispatchEvent(e);
          }
          api.html = function(selector) {
            return this.$(selector || 'body').innerHTML;
          }
          readyCallback.apply(api, [errors, window]);
        }
      });
    }

    api.ready = function(cb) {
      readyCallback = cb;
      process();
    }

    return api;

  }
}