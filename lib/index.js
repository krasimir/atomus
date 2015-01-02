var network = require('./network');
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

        window.onclick = true;
        window.onchange = true;
        window.onblur = true;
        window.onfocus = true;
        window.onchecked = true;
        window.onselected = true;
        window.onkeyup = true;

        var $;
        var trigger = function(element, event, eventGroup, keyCode) {
          var e = window.document.createEvent(eventGroup || 'MouseEvents');
          if(keyCode) e.keyCode = e.which = keyCode;
          e.initEvent(event, true, true);
          return element.dispatchEvent(e);
        };
        var isJQueryEl = function(el) {
          return el instanceof window.jQuery;
        };
        var createJQueryEvent = function(type, code) {
          var e = api.window.$.Event(type);
          e.which = e.keyCode = code;
          return e;
        };

        api.$ = $ = function(selector) {
          return window.$(selector);
        };
        api.window = window;
        api.window.log = function(o) { 
          console.log(o);
        };
        api.clicked = function(el) {
          if(isJQueryEl(el)) {
            trigger(el[0], 'click');
          } else {
            trigger(el, 'click');
          }
          return this;
        };
        api.changed = function(el) {
          if(isJQueryEl(el)) {
            trigger(el[0], 'change');
          } else {
            trigger(el, 'change');
          }
          return this;
        };
        api.focused = function(el) {
          if(isJQueryEl(el)) {
            trigger(el[0], 'focus');
          } else {
            trigger(el, 'focus');
          }
          return this;
        };
        api.blurred = function(el) {
          if(isJQueryEl(el)) {
            trigger(el[0], 'blur');
          } else {
            trigger(el, 'blur');
          }
          return this;
        };
        api.selected = function(el) {
          if(isJQueryEl(el)) {
            el.trigger('click');
          } else {
            this.$(el).trigger('click');
          }
          return this;
        };
        api.keypressed = function(el, keyCode) {
          if(isJQueryEl(el)) {
            trigger(el[0], 'keypress', 'Events', keyCode);
          } else {
            trigger(el, 'keypress', 'Events', keyCode);
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
        api.waitUntil = function(domElSelector, callback) {
          var self = this, el = this.$(domElSelector), promiseish = {}, cb = callback;
          promiseish.then = function(fn) {
            cb = fn;
          };
          if(el.length === 0) {
            setTimeout(function() {
              self.waitUntil(domElSelector, cb);
            }, 50);
          } else {
            if(cb) cb.apply(this, [el]);
          }
          return promiseish;
        };
        api.changeValueOf = function(el, value) {
          el = isJQueryEl(el) ? el : $(el);
          el.val(value);
          return this.changed(el);
        };
        api.addXHRMock = function(m) {
          if(!this.network) {
            this.network = network(window);
          }
          this.network.addMock(m);
          return this;
        };
        api.clearXHRMocks = function() {
          if(!this.network) {
            this.network = network(window);
          }
          this.network.clearXHRMocks();
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