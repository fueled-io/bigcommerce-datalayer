import { ready, htmlDecode } from './utils';
import {
  onProductListView,
  onProductDetailsView,
  onCheckoutStarted,
  onPurchase,
  onViewCart,
} from './bigCommerceDataLayer';
import { getCheckoutData } from './checkout-started';

(function (window) {
  'use strict';
  window.ready = ready;
  addDataLayerListener(); // Listener for Push events
})(this);

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
