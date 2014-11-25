module.exports = function(ops) {

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

        var trigger = function(element, event, eventGroup) {
          var e = window.document.createEvent(eventGroup || 'MouseEvents');
          e.initEvent(event, true, true);
          return element.dispatchEvent(e);
        }

        api.$ = function(selector) {
          return window.$(selector);
        };

        api.clicked = function(el) {
          el instanceof window.jQuery ? trigger(el[0], 'click') : trigger(el, 'click');
          return this;
        };
        api.changed = function(el) {
          el instanceof window.jQuery ? trigger(el[0], 'change') : trigger(el, 'change');
          return this;
        };
        api.focused = function(el) {
          el instanceof window.jQuery ? trigger(el[0], 'focus') : trigger(el, 'focus');
          return this;
        };
        api.blurred = function(el) {
          el instanceof window.jQuery ? trigger(el[0], 'blur') : trigger(el, 'blur');
          return this;
        };
        api.selected = function(el) {
          el instanceof window.jQuery ? el.trigger('click') : this.$(el).trigger('click');
          return this;
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