var fs = require('fs');
var network = require('./network');

module.exports = function(ops) {

  if(!ops) ops = {};

  ops.scripts = ops.scripts || [];
  ops.scripts.push(__dirname + '/polyfills/localStorage.js');
  ops.scripts.push(__dirname + '/vendor/jquery-1.11.1.min.js');

  // defaults
  var options = {
    html: ops.html || '<!doctype html><html><head></head><body></body></html>',
    scripts: ops.scripts,
    FetchExternalResources: ops.FetchExternalResources || ["script"],
    ProcessExternalResources: ops.ProcessExternalResources || ["script"],
    injectJS: ops.injectJS || '',
    printBootstrapErrors: typeof ops.printBootstrapErrors === 'undefined' ? false : ops.printBootstrapErrors
  };
  var api = {}, readyCallback;
  var injectJS = function() {
    if(options.html.indexOf('<head>') >= 0) {
      options.html = options.html.replace('</head>', '<script type="text/javascript">' + options.injectJS + '</script></head>');
    } else {
      options.html = '<head><script>' + options.injectJS + '</script></head>' + options.html;
    }
    // adding the polyfill at the very top in the head tag
    options.html = options.html.replace(
      '<head>',
      '<head><script type="text/javascript">' + getConsoleLogPolyfill() + '</script>'
    );
  };

  injectJS();

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
        if(errors !== null && options.printBootstrapErrors) {
          console.log('Errors', errors);
        }

        window.onclick = false;
        window.onchange = false;
        window.onblur = false;
        window.onfocus = false;
        window.onchecked = false;
        window.onselected = false;
        window.onkeyup = false;

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
          return this.triggerEvent(el, 'keypress', keyCode);
        };
        api.triggerEvent = function(el, eventType, keyCode) {
          if(isJQueryEl(el)) {
            trigger(el[0], eventType, 'Events', keyCode);
          } else {
            trigger(el, eventType, 'Events', keyCode);
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

        window.__AtomusShowLogs();

        // give a chance to jsdom to process the JavaScript
        setTimeout(function() {
          readyCallback.apply(api, [errors, window]);
        }, 10);

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
  api.injectJS = function(js) {
    options.injectJS = js;
    injectJS();
    return api;
  };
  api.html = function(htmlStr) {
    options.html = htmlStr;
    injectJS();
    return api;
  };

  return api;

};

function getConsoleLogPolyfill() {
  return '\
    var __AtomusLogs = [];\
    __AtomusShowLogs = window.__AtomusShowLogs = function() {\
      for(var i=0; i<__AtomusLogs.length; i++) {\
        window.log.apply(window, __AtomusLogs[i]);\
      }\
    };\
    console = {\
      log: function() {\
        var args = Array.prototype.slice.call(arguments);\
        if(window.log) {\
          window.log.apply(window, args);\
        } else {\
          if(!__AtomusLogs) {\
            __AtomusLogs = [];\
          }\
          __AtomusLogs.push(args);\
        }\
      }\
    };\
    var __AtomusConsoleMethods = (\'assert,clear,count,debug,dir,dirxml,error,exception,group, groupCollapsed,groupEnd,info,markTimeline,profile,profiles,profileEnd, show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn\').split(\',\');\
    while(___m = __AtomusConsoleMethods.pop()) console[___m] = console.log;\
  ';
}
