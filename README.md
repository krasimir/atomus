# Atomus

A small utility library for testing client-side code in Node.js. Simulate the browser in your terminal.

## The problem

We all know about Selenium and PhantomJS. They work well for testing client-side code. We may visit a page, fill forms, click buttons etc. However, it gets complex if we want to test only part of our application. We have to create a page that contains only the needed pieces. This definitely does not scale.

Atomus is helpful during unit or functional testing. That's where the name came from. It works good with the atoms of your application. You simply include your framework and the module that needs testing. Then create an instance and start playing with the DOM and the module's API.

## Simple usage

All you have to do is to require the module, call the `browser` method and wait for the initialization:

```js
var atomus = require('atomus');
var b = atomus.browser();
b.ready(function(errors, window) {
  ...
});
```
The `window` that is passed to our callback is the good old Window object that we have in every browser. Thankfully to [jsdom](https://www.npmjs.org/package/jsdom) we have a JavaScript implementation of the WHATWG DOM and HTML standards. So we may call `window.document.querySelector` or `element.dispatchEvent`. In practice we may interact with the page as we are in a real browser.

## The API

To illustrate the available API we will simply look into a slightly more complex example:

```js
var atomus = require('atomus');
var b = atomus.browser();
// serting default html for the page
b.html('<section><a href="#" id="link">click me</a></section>')
.external('vendor/angularjs.min.js')
.external('src/my-module.js')
.ready(function(errors, window) {
  
  // calling `b.$` is equal to calling `window.document.querySelector`
  var link = b.$('#link');

  // here we listen for a DOM event bubbled to the `body` tag
  b.on('click', function(event) {
    e.preventDefault();
    console.log('clicked');
  });

  // here we listen for a DOM event dispatched by the link on the page
  b.on('click', link, function(event) {
    e.preventDefault();
    console.log('clicked');
  });

  // triggering an event
  b.trigger(link, 'click');

});
```

An alternative syntax for setting the initial HTML on the page and the external resources is:

```js
var atomus = require('atomus');
var b = atomus.browser({
  html: '<h1>Blah blah</h1>',
  scripts: [
    'vendor/angularjs.min.js',
    'src/my-module.js'
  ]
});
```

## Tests

* `npm install`
* `npm test`

You may be interested to see how Atomus work with AngularJS. Checkout `03.angular.spec.js` file.

## Tips

* Have in mind that often you have to take about the event triggering. For example if you change the value of a input field by setting `.value` property you need to dispatch a `change` event. Otherwise you will not get the listeners called.
* The global scope is accessible via the window object. So if you import Angular on the page you need to reference it through `window.Angular` and not just `Angular`.
* Atomus is based on [JSDOM](https://www.npmjs.org/package/jsdom) is not simulating everything. You may not be able to use the History API for example

## Other resources

* [Unit test your client-side JavaScript](http://krasimirtsonev.com/blog/article/unit-test-your-client-side-javascript-jsdom-nodejs)
* [JSDOM](https://www.npmjs.org/package/jsdom) 