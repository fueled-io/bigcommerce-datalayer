import { ready, htmlDecode } from "./functions";
import {
  onProductListView,
  onProductDetailsView,
  onCheckoutStarted,
  onPurchase,
  onViewCart,
} from "./bigCommerceDataLayer";
import { beforeStart } from "./api";

(function (window) {
  "use strict";
  window.ready = ready;
  beforeStart();
})(this);

var pageType = "{{page_type}}";
var categoryProducts = "{{json category.products}}";

if (pageType === "category") {
  onProductListView(htmlDecode(categoryProducts));
} else if (pageType === "product") {
  onProductDetailsView();
} else if (pageType === "checkout") {
  onCheckoutStarted();
} else if (pageType === "orderconfirmation") {
  onPurchase();
} else if (pageType === "cart") {
  onViewCart();
}
