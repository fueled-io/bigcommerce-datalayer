import Ajv, { ValidationError } from 'ajv';
const yotpoSchema = require('../schema/datalayer.schema.json');

// Schema validation

const ajv = new Ajv();
ajv.addSchema(yotpoSchema);

export default function validateDatalayerJson(object, type) {
  const validate = ajv.getSchema(`https://fueled.io/schemas/datalayer/v1.0#/$defs/${type}`);
  if (!validate) throw new Error(`Couldn't find the right schema: ${type}`);

  const valid = validate(object);
  if (!valid) {
    console.debug(object);
    throw new ValidationError(validate.errors);
  }
}

// DataLayer Listener

export function addDataLayerListener(callback) {
  dataLayer.push = function(e) {
      Array.prototype.push.call(dataLayer, e);
      if(dataLayer && dataLayer.length > 0) {
        const dataLayerLength = dataLayer.length;
        const lastAddedItem = dataLayer[dataLayerLength -1];
        validateDatalayerJson(lastAddedItem, 'event');
        validateDatalayerJson(lastAddedItem, 'ecommerce');
        validateDatalayerJson(lastAddedItem, 'shopper');
      }
  };
};

// BigCommerce 

var listeners = [],
  doc = window.document,
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
  observer;

export function ready(selector, fn) {
  // Store the selector and callback to be monitored
  listeners.push({
    selector: selector,
    fn: fn,
  });
  if (!observer) {
    // Watch for changes in the document
    observer = new MutationObserver(check);
    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  // Check if the element is currently in the DOM
  check();
}

export function check() {
  // Check the DOM for elements matching a stored selector
  for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
    listener = listeners[i];
    // Query for elements matching the specified selector
    elements = doc.querySelectorAll(listener.selector);
    for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
      element = elements[j];
      // Make sure the callback isn't invoked with the
      // same element more than once
      if (!element.ready) {
        element.ready = true;
        // Invoke the callback with the element
        listener.fn.call(element, element);
      }
    }
  }
}

export function htmlDecode(input) {
  var parsedInput = input.replace(/(\r\n|\n|\r)/gm, '');
  var doc = new DOMParser().parseFromString(parsedInput, 'text/html');
  return JSON.parse(doc.documentElement.textContent);
}
