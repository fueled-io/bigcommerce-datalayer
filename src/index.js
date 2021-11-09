import {
  onProductListView,
  onProductDetailsView,
  onCheckoutStarted,
  onPurchase,
  onViewCart,
} from './bigCommerceDataLayer';


/* 
  BigCommerce Utils 
*/

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


// DataLayer Listener

if (WEBPACK_MODE === 'production' || WEBPACK_MODE === 'development') {
  validateDatalayerJson = () => ({});
} else {
  validateDatalayerJson = require('./testUtils');
}

export function addDataLayerListener(callback) {
  dataLayer.push = function (e) {
    Array.prototype.push.call(dataLayer, e);
    if (dataLayer && dataLayer.length > 0) {
      const dataLayerLength = dataLayer.length;
      const lastAddedItem = dataLayer[dataLayerLength - 1];
      validateDatalayerJson(lastAddedItem, 'event');
      validateDatalayerJson(lastAddedItem, 'ecommerce');
      validateDatalayerJson(lastAddedItem, 'shopper');
    }
  };
};

/*
  Checkout Started
*/

const mailSelector = document.getElementsByClassName('customerView-body');
const { checkoutId } = window.checkoutConfig;
let userEmail = '';
let analyticsData = {};
const products = [];

async function getData() {
  const url = `/api/storefront/checkouts/${checkoutId}`;
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export function getCheckoutData() {
  getData().then((data) => {
    if (data.cart.lineItems.physicalItems.length) {
      for (const product of data.cart.lineItems.physicalItems) {
        products.push({
          product_id: product.productId,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          price: product.salePrice,
          quantity: product.quantity,
          url: product.url,
          image_url: product.imageUrl,
        });
      }
      analyticsData = {
        checkout_id: data.id,
        order_id: data.orderId,
        value: data.grandTotal,
        revenue: data.subtotal,
        shipping: data.shippingCostTotal,
        tax: data.taxTotal,
        discount: data.cart.discountAmount,
        coupon: data.cart.coupons,
        currency: data.cart.currency.code,
        products: products,
      };
    }
  });

  if (mailSelector && mailSelector[0]) {
    userEmail = mailSelector[0].innerHTML;
    analyticsData.userId = userEmail;
  }
}

/*
  BigCommerce Events Manager
*/


(function (window) {
  'use strict';
  window.ready = ready;
  addDataLayerListener(); // Listener for Push events
})(this);

if (!window.dataLayer) window.dataLayer = [];
dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.

var pageType = '{{page_type}}';
var categoryProducts = '{{json category.products}}';
ready('.body', addProductEventListeners); // Clicks listeners

if (pageType === 'category') {
  onProductListView(htmlDecode(categoryProducts));
} else if (pageType === 'product') {
  onProductDetailsView();
} else if (pageType === 'checkout') {
  getCheckoutData();
  onCheckoutStarted();
} else if (pageType === 'orderconfirmation') {
  onPurchase();
} else if (pageType === 'cart') {
  onViewCart();
}
