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
        if(errors !== null) console.log('Errors', errors);

        api.window = window;

        window.onclick = true;
        window.onchange = true;
        window.onblur = true;
        window.onfocus = true;
        window.onchecked = true;
        window.onselected = true;
        window.onkeyup = true;

        api.window.log = function(o) { 
          console.log(o);
        };

        var trigger = function(element, event, eventGroup) {
          var e = window.document.createEvent(eventGroup || 'MouseEvents');
          e.initEvent(event, true, true);
          return element.dispatchEvent(e);
        };

        api.$ = function(selector) {
          return window.$(selector);
        };

        api.clicked = function(el) {
          if(el instanceof window.jQuery) {
            trigger(el[0], 'click');
          } else {
            trigger(el, 'click');
          }
          return this;
        };
        api.changed = function(el) {
          if(el instanceof window.jQuery) {
            trigger(el[0], 'change');
          } else {
            trigger(el, 'change');
          }
          return this;
        };
        api.focused = function(el) {
          if(el instanceof window.jQuery) {
            trigger(el[0], 'focus');
          } else {
            trigger(el, 'focus');
          }
          return this;
        };
        api.blurred = function(el) {
          if(el instanceof window.jQuery) {
            trigger(el[0], 'blur');
          } else {
            trigger(el, 'blur');
          }
          return this;
        };
        api.selected = function(el) {
          if(el instanceof window.jQuery) {
            el.trigger('click');
          } else {
            this.$(el).trigger('click');
          }
          return this;
        };
        api.errors = function() {
          return window.document.errors;
        };
        api.lastError = function() {
          if(window.document.errors && window.document.errors.length > 0)
            return window.document.errors.pop();
          else
            return null;
        };
        api.waitUntil = function(domElSelector, cb) {
          var self = this, el = this.$(domElSelector);
          if(el.length === 0) {
            setTimeout(function() {
              self.waitUntil(domElSelector, cb);
            }, 50);
          } else {
            cb(el);
          }
        };

        readyCallback.apply(api, [errors, window]);

      }
    });
  };

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
  };

  return api;

};