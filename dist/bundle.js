/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"beforeStart\": () => (/* binding */ beforeStart)\n/* harmony export */ });\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ \"./src/functions.js\");\n/* harmony import */ var _bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bigCommerceDataLayer */ \"./src/bigCommerceDataLayer.js\");\n\r\n\r\n\r\nconst mailSelector = document.getElementsByClassName(\"customerView-body\");\r\nconst { checkoutId } = window.checkoutConfig;\r\nlet userEmail = \"\";\r\nlet analyticsData = {};\r\nconst products = [];\r\n\r\nasync function getData() {\r\n  const url = `/api/storefront/checkouts/${checkoutId}`;\r\n  const response = await fetch(url, {\r\n    method: \"GET\",\r\n    cache: \"no-cache\",\r\n    headers: {\r\n      \"Content-Type\": \"application/json\",\r\n    },\r\n  });\r\n  return response.json();\r\n}\r\n\r\nfunction beforeStart() {\r\n  getData().then((data) => {\r\n    if (data.cart.lineItems.physicalItems.length) {\r\n      for (const product of data.cart.lineItems.physicalItems) {\r\n        products.push({\r\n          product_id: product.productId,\r\n          sku: product.sku,\r\n          name: product.name,\r\n          brand: product.brand,\r\n          price: product.salePrice,\r\n          quantity: product.quantity,\r\n          url: product.url,\r\n          image_url: product.imageUrl,\r\n        });\r\n      }\r\n      analyticsData = {\r\n        checkout_id: data.id,\r\n        order_id: data.orderId,\r\n        value: data.grandTotal,\r\n        revenue: data.subtotal,\r\n        shipping: data.shippingCostTotal,\r\n        tax: data.taxTotal,\r\n        discount: data.cart.discountAmount,\r\n        coupon: data.cart.coupons,\r\n        currency: data.cart.currency.code,\r\n        products: products,\r\n      };\r\n    }\r\n  });\r\n\r\n  (0,_functions__WEBPACK_IMPORTED_MODULE_0__.ready)(\".customerView-body\", function () {\r\n    if (mailSelector && mailSelector[0]) {\r\n      console.log(1);\r\n      userEmail = mailSelector[0].innerHTML;\r\n      analyticsData.userId = userEmail;\r\n    }\r\n\r\n    analyticsData.step = 1;\r\n\r\n    window.analytics.track(\"Checkout Step Completed\", {\r\n      ...analyticsData,\r\n    });\r\n\r\n    window.analytics.identify(userEmail, {\r\n      email: userEmail,\r\n    });\r\n  });\r\n\r\n  (0,_functions__WEBPACK_IMPORTED_MODULE_0__.ready)(\".checkout-step--payment\", function () {\r\n    if (checkoutId) {\r\n      window.analytics.track(\"Checkout Started\", {\r\n        ...analyticsData,\r\n      });\r\n    }\r\n  });\r\n\r\n  (0,_functions__WEBPACK_IMPORTED_MODULE_0__.ready)(\".body\", _bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.addProductEventListeners);\r\n}\r\n\n\n//# sourceURL=webpack://bigcommerce-datalayer/./src/api.js?");

/***/ }),

/***/ "./src/bigCommerceDataLayer.js":
/*!*************************************!*\
  !*** ./src/bigCommerceDataLayer.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"addProductEventListeners\": () => (/* binding */ addProductEventListeners),\n/* harmony export */   \"onProductListView\": () => (/* binding */ onProductListView),\n/* harmony export */   \"onProductClick\": () => (/* binding */ onProductClick),\n/* harmony export */   \"onProductDetailsView\": () => (/* binding */ onProductDetailsView),\n/* harmony export */   \"onViewCart\": () => (/* binding */ onViewCart),\n/* harmony export */   \"onAddToCart\": () => (/* binding */ onAddToCart),\n/* harmony export */   \"onRemoveFromCart\": () => (/* binding */ onRemoveFromCart),\n/* harmony export */   \"onCheckoutStarted\": () => (/* binding */ onCheckoutStarted),\n/* harmony export */   \"onPurchase\": () => (/* binding */ onPurchase)\n/* harmony export */ });\nif (!window.dataLayer) window.dataLayer = [];\r\ndataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.\r\n\r\nvar dataLayer = window.dataLayer;\r\nvar analyticsData = window.analyticsData;\r\n\r\n// Assets\r\n// var cartProducts = \"{{json cart.items}}\";\r\n// var userEmail = \"{{cutomer.email}}\" || null;\r\n\r\nfunction addProductEventListeners() {\r\n  var productDetailsButton =\r\n    document.getElementsByClassName(\"card-figure__link\") || [];\r\n  var mainPageAddButton =\r\n    document.querySelectorAll(\"[data-button-type='add-cart']\") || [];\r\n  var productPageAddButton = document.getElementById(\"form-action-addToCart\");\r\n  var cartPageRemoveButton =\r\n    document.getElementsByClassName(\"cart-remove\") || [];\r\n\r\n  // Product Details\r\n  if (productDetailsButton.length > 0) {\r\n    productDetailsButton.forEach((el) =>\r\n      el.addEventListener(\"click\", () => {\r\n        onProductClick(el.attributes[2].nodeValue);\r\n      })\r\n    );\r\n  }\r\n\r\n  // Main Page - Add to Cart click\r\n  if (mainPageAddButton.length > 0) {\r\n    mainPageAddButton.forEach((el) =>\r\n      el.addEventListener(\"click\", (event) => {\r\n        var index = event.target.href.indexOf(\"product_id\");\r\n        var productId = event.target.href.slice(index).split(\"=\")[1];\r\n        onAddToCart(productId);\r\n      })\r\n    );\r\n  }\r\n\r\n  // Product Page - Add to Cart click\r\n  if (productPageAddButton) {\r\n    productPageAddButton.addEventListener(\"click\", () => {\r\n      onAddToCart(\"{{product.id}}\");\r\n    });\r\n  }\r\n\r\n  // Remove from Cart click\r\n  if (cartPageRemoveButton.length > 0) {\r\n    cartPageRemoveButton.forEach((el) =>\r\n      el.addEventListener(\"click\", () => {\r\n        onRemoveFromCart(el.attributes[1].nodeValue);\r\n      })\r\n    );\r\n  }\r\n}\r\n\r\n// Measure product/item list views/impressions\r\nfunction onProductListView(products) {\r\n  dataLayer.push({\r\n    event: \"view_item_list\",\r\n    ecommerce: {\r\n      items: products.map((item) => {\r\n        var categoryArray = item.category.map((category, key) => ({\r\n          [`item_category${key + 1}`]: category,\r\n        }));\r\n\r\n        var categories = Object.assign({}, ...categoryArray);\r\n\r\n        return {\r\n          item_name: item.name,\r\n          item_id: item.id,\r\n          price: item.price.without_tax.value,\r\n          item_brand: item.brand.name,\r\n          ...categories,\r\n          item_list_name: \"{{category.name}}\",\r\n          item_list_id: \"{{category.id}}\",\r\n          index: 1,\r\n          quantity: 1,\r\n        };\r\n      }),\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\n// Call this function when a user clicks on a product link\r\nfunction onProductClick(productName) {\r\n  dataLayer.push({\r\n    event: \"select_item\",\r\n    ecommerce: {\r\n      items: [\r\n        {\r\n          item_name: productName,\r\n        },\r\n      ],\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\n// Measure a view of product details. This example assumes the detail view occurs on pageload,\r\nfunction onProductDetailsView() {\r\n  dataLayer.push({\r\n    event: \"view_item\",\r\n    ecommerce: {\r\n      items: [\r\n        {\r\n          item_name: \"{{product.title}}\", // Name or ID is required.\r\n          item_id: \"{{product.id}}\",\r\n          price: \"{{product.price.without_tax.value}}\",\r\n          item_category: \"{{product.category}}\",\r\n          item_variant: \"{{product.sku}}\",\r\n        },\r\n      ],\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\n\r\n// This event signifies that a user viewed their cart.\r\nfunction onViewCart() {\r\n  dataLayer.push({\r\n    event: \"view_cart\",\r\n    ecommerce: {\r\n      items: analyticsData.products,\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\n// Measure when a product is added to a shopping cart\r\nfunction onAddToCart(productId) {\r\n  dataLayer.push({\r\n    event: \"add_to_cart\",\r\n    ecommerce: {\r\n      items: [\r\n        {\r\n          item_name: \"{{product.title}}\", // Name or ID is required.\r\n          item_id: productId,\r\n          price: \"{{product.price.without_tax.value}}\",\r\n          item_category: \"{{product.category}}\",\r\n          item_variant: \"{{product.sku}}\",\r\n        },\r\n      ],\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\nfunction onRemoveFromCart(cartItemId) {\r\n  dataLayer.push({\r\n    event: \"remove_from_cart\",\r\n    ecommerce: {\r\n      cart_item_id: cartItemId,\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\nfunction onCheckoutStarted() {\r\n  dataLayer.push({\r\n    event: \"begin_checkout\",\r\n    ecommerce: {\r\n      items: analyticsData.products,\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\r\nfunction onPurchase() {\r\n  dataLayer.push({\r\n    event: \"purchase\",\r\n    ecommerce: {\r\n      purchase: {\r\n        products: analyticsData.products,\r\n      },\r\n    },\r\n    shopper: {\r\n      customer_id: analyticsData.userId,\r\n      email: analyticsData.userId,\r\n      externalCustomerId: analyticsData.userId,\r\n    },\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://bigcommerce-datalayer/./src/bigCommerceDataLayer.js?");

/***/ }),

/***/ "./src/functions.js":
/*!**************************!*\
  !*** ./src/functions.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ready\": () => (/* binding */ ready),\n/* harmony export */   \"check\": () => (/* binding */ check),\n/* harmony export */   \"htmlDecode\": () => (/* binding */ htmlDecode)\n/* harmony export */ });\nvar listeners = [],\r\n    doc = window.document,\r\n    MutationObserver = window.MutationObserver || window.WebKitMutationObserver,\r\n    observer;\r\n\r\n\r\nfunction ready(selector, fn) {\r\n  // Store the selector and callback to be monitored\r\n  listeners.push({\r\n    selector: selector,\r\n    fn: fn,\r\n  });\r\n  if (!observer) {\r\n    // Watch for changes in the document\r\n    observer = new MutationObserver(check);\r\n    observer.observe(doc.documentElement, {\r\n      childList: true,\r\n      subtree: true,\r\n    });\r\n  }\r\n  // Check if the element is currently in the DOM\r\n  check();\r\n}\r\n\r\nfunction check() {\r\n  // Check the DOM for elements matching a stored selector\r\n  for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {\r\n    listener = listeners[i];\r\n    // Query for elements matching the specified selector\r\n    elements = doc.querySelectorAll(listener.selector);\r\n    for (var j = 0, jLen = elements.length, element; j < jLen; j++) {\r\n      element = elements[j];\r\n      // Make sure the callback isn't invoked with the\r\n      // same element more than once\r\n      if (!element.ready) {\r\n        element.ready = true;\r\n        // Invoke the callback with the element\r\n        listener.fn.call(element, element);\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nfunction htmlDecode(input) {\r\n  var parsedInput = input.replace(/(\\r\\n|\\n|\\r)/gm, \"\");\r\n  var doc = new DOMParser().parseFromString(parsedInput, \"text/html\");\r\n  return JSON.parse(doc.documentElement.textContent);\r\n}\r\n\r\n\n\n//# sourceURL=webpack://bigcommerce-datalayer/./src/functions.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ \"./src/functions.js\");\n/* harmony import */ var _bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bigCommerceDataLayer */ \"./src/bigCommerceDataLayer.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ \"./src/api.js\");\n\r\n\r\n\r\n\r\n(function (window) {\r\n  \"use strict\";\r\n  window.ready = _functions__WEBPACK_IMPORTED_MODULE_0__.ready;\r\n  (0,_api__WEBPACK_IMPORTED_MODULE_2__.beforeStart)();\r\n})(undefined);\r\n\r\nvar pageType = \"{{page_type}}\";\r\nvar categoryProducts = \"{{json category.products}}\";\r\n\r\nif (pageType === \"category\") {\r\n  (0,_bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.onProductListView)((0,_functions__WEBPACK_IMPORTED_MODULE_0__.htmlDecode)(categoryProducts));\r\n} else if (pageType === \"product\") {\r\n  (0,_bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.onProductDetailsView)();\r\n} else if (pageType === \"checkout\") {\r\n  (0,_bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.onCheckoutStarted)();\r\n} else if (pageType === \"orderconfirmation\") {\r\n  (0,_bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.onPurchase)();\r\n} else if (pageType === \"cart\") {\r\n  (0,_bigCommerceDataLayer__WEBPACK_IMPORTED_MODULE_1__.onViewCart)();\r\n}\r\n\n\n//# sourceURL=webpack://bigcommerce-datalayer/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;