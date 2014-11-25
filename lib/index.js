module.exports = {
  browser: function(ops) {

    if(!ops) ops = {};

    ops.scripts = ops.scripts || [];
    ops.scripts.push(__dirname + '/vendor/jquery-1.11.1.min.js');

    // defaults
    var options = {
      html: ops.html || '<!doctype html><html><head></head><body></body></html>',
      scripts: ops.scripts,
      FetchExternalResources: ops.FetchExternalResources || ["script"],
      ProcessExternalResources: ops.ProcessExternalResources || ["script"]
    };
    var api = {}, readyCallback;

    var process = function() {
      var jsdom = require("jsdom");
      jsdom.env({
        html: options.html,
        scripts: options.scripts,
        features: {
          FetchExternalResources: options.FetchExternalResources,
          ProcessExternalResources: options.ProcessExternalResources
        },
        done: function(errors, window) {
          api.window = window;
          api.$ = function(selector) {
            return window.$(selector);
          };
          api.trigger = function(element, event) {
            var e = window.document.createEvent('MouseEvents');
            e.initEvent(event, true, true);
            if(element instanceof window.jQuery) {
              element[0].dispatchEvent(e);
            } else {
              element.dispatchEvent(e);
            }
          }
          api.on = function(event, el, cb) {
            if(typeof el === 'function') {
              cb = el;
              el = api.$('body')[0];
            }
            el.addEventListener(event, cb, false);
          }
          readyCallback.apply(api, [errors, window]);
        }
      });
    }

    api.ready = function(cb) {
      readyCallback = cb;
      process();
      return api;
    };
    api.external = function(file) {
      options.scripts.push(file);
      return api;
    };
    api.html = function(htmlStr) {
      options.html = htmlStr;
      return api;
    }


    return api;

  }
}