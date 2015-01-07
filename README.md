
![Atomus](http://work.krasimirtsonev.com/atomus/atomus.jpg)

---

A small utility library for testing client-side code in Node.js environment. Simulate the browser in your terminal.

## The problem

We all know about Selenium and PhantomJS. They work well for testing client-side code. We may visit a page, fill forms, click buttons etc. However, it gets complex if we want to test only part of our application. We have to create a page that contains only the needed pieces. This definitely does not scale.

Atomus is helpful during unit or functional testing. That's where the name came from. It works good with the atoms of your application. You simply include your framework and the module that needs testing. Then create an instance and start playing with the DOM and the module's API.

## Installation

`npm install atomus`

## Simple usage

All you have to do is to require the module, call the `ready` method:

```js
var htmlStr = '<body><h1>Atomus</h1></body>';
var atomus = require('atomus');
var browser = atomus().html(htmlStr).ready(function(errors, window) {
  ...
});
```
The `window` that is passed to our callback is the good old Window object that we have in every browser. Thankfully to [jsdom](https://www.npmjs.org/package/jsdom) we have a JavaScript implementation of the WHATWG DOM and HTML standards. So we may call `window.document.querySelector` or `element.dispatchEvent`. In practice we may interact with the page as we are in a real browser.

## API

* `browser.ready([callback])` - call this method when you are ready with configuring your browser. The callback receives `errors` and `window` object.
* `browser.external([filepath])` - add an absolute path to JavaScript file that you want to be injected into the page. This may be a framework or custom bundled JavaScript for example.
* `browser.html([string])` - the initial HTML markup of the page
* `browser.injectJS([string])` - injects JavaScript just before the closing of `<head>` tag

Once the `ready` method is called we have a few other methods and objects available. 

* `browser.$` - jQuery
* `browser.window` - the usual Window object
* `browser.clicked([jQuery object or DOM element])` - fires `click` event.
* `browser.changed([jQuery object or DOM element])` - fires `change` event
* `browser.focused([jQuery object or DOM element])` - fires `focus` event
* `browser.blurred([jQuery object or DOM element])` - fires `blur` event
* `browser.keypressed([jQuery object or DOM element], [keyCode])` - fires `keypress` event with particular **keyCode**.
* `browser.selected([jQuery object or DOM element])` - fires `click` event. Use this while you operate with radio or checkboxes. 
* `browser.waitUntil([element's selector], [function])` - it calls the function once the element matching the elector exists in the DOM
* `browser.changeValueOf([jQuery object or DOM element], [value])` - use this method to change the value of text input, textarea or dropdown/select element. It changes the value and dispatches a `change` event.
* `browser.addXHRMock([object or array])` - by default Atomus performs real HTTP requests. That's a way to mock these requests and provide your own response. Checkout the example section below.
* `browser.clearXHRMocks()` - clearing the already added XHR mocks
* `browser.triggerEvent([element], [eventType], [keyCode]) - triggers a DOM event on particular element with particular `keyCode`

JSDom has some problems with radio and checkboxes selecting. That's why we introduced API methods for triggering events. For sure you may use `$('#link').trigger('click')` but that's not working properly in some cases. So, we recommend using `browser` API for dispatching DOM events.

## Example

### Clicking a link on the page.

```js
  var atomus = require('atomus');
  atomus()
  .html('<section><a href="#" id="link">click me</a></section>')
  .external(__dirname + '/libs/myframework.min.js')
  .ready(function(errors, window) {
    var $ = this.$; // jQuery
    $('#link').on('click', function() {
      console.log('link clicked');
    });
    this.clicked($('#link'));
  });
```

An alternative syntax for setting the initial HTML on the page and the external resources is:

```js
var atomus = require('atomus');
var b = atomus({
  html: '<h1>Blah blah</h1>',
  scripts: [
    'vendor/angularjs.min.js',
    'src/my-module.js'
  ]
});
```
### Mocking HTTP requests

```js

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
  b.addXHRMock(mockups);

  window.AjaxWrapper().request({
    url: '/api/method/action',
    json: true
  }).done(function(result) {
    console.log(result.id); // AAA
    
    window.AjaxWrapper().request({
      url: '/api/method/action',
      json: true,
      method: 'POST'
    }).done(function(result) {
      console.log(result.success); // OK
    });

  });

});
```

### Injecting JavaScript into the head of the document

```js
var b = atomus()
.html('<html><head></head><body></body></html>')
.injectJS('var getTheAnswer = function() { return 42; }')
.ready(function(errors, window) {
  console.log(window.getTheAnswer()); // 42
});
```

## Tests

* `npm install`
* `npm test`

Checkout the `test` folder. There are tests that run Atomus against [AngularJS](https://angularjs.org/) and [Ractive.js](http://www.ractivejs.org/) frameworks.

## Notes

* Have in mind that often you have to take care about the events' triggering. For example if you change the value of an input field by setting `.value` property you need to dispatch a `change` event. Otherwise you will not get the listeners called.
* The global scope is accessible via the window object. So if you import Angular, for example, on the page you need to reference it through `window.Angular` and not just `Angular`.
* Atomus is based on [JSDOM](https://www.npmjs.org/package/jsdom) which is not simulating everything. You may not be able to use the History API for example.
* Atomus successfully patches the `console.log` calls so you receive all the logs into the terminal
* The library supports `localStorage`. However, it is not part of jsdom. It's a polyfill.

## Other resources

* [Unit test your client-side JavaScript](http://krasimirtsonev.com/blog/article/unit-test-your-client-side-javascript-jsdom-nodejs)
* [JSDOM](https://www.npmjs.org/package/jsdom) 

## Contributers

* [Krasimir Tsonev](https://github.com/krasimir)
* [Robin Allen](https://github.com/robin-allen)
