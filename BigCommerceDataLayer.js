var ready;
var analyticsData;

if (!window.dataLayer) window.dataLayer = [];
var dataLayer = window.dataLayer;
dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.

// Assets

function htmlDecode(input) {
  var parsedInput = input.replace(/(\r\n|\n|\r)/gm, "");
  var doc = new DOMParser().parseFromString(parsedInput, "text/html");
  return JSON.parse(doc.documentElement.textContent);
}

var pageType = "{{page_type}}";
var categoryProducts = "{{json category.products}}";
// var cartProducts = "{{json cart.items}}";
// var userEmail = "{{cutomer.email}}" || null;

function addProductEventListeners() {
  var productDetailsButton =
    document.getElementsByClassName("card-figure__link") || [];
  var mainPageAddButton =
    document.querySelectorAll("[data-button-type='add-cart']") || [];
  var productPageAddButton = document.getElementById("form-action-addToCart");
  var cartPageRemoveButton =
    document.getElementsByClassName("cart-remove") || [];

  // Product Details
  if (productDetailsButton.length > 0) {
    productDetailsButton.forEach((el) =>
      el.addEventListener("click", () => {
        onProductClick(el.attributes[2].nodeValue);
      })
    );
  }

  // Main Page - Add to Cart click
  if (mainPageAddButton.length > 0) {
    mainPageAddButton.forEach((el) =>
      el.addEventListener("click", (event) => {
        var index = event.target.href.indexOf("product_id");
        var productId = event.target.href.slice(index).split("=")[1];
        onAddToCart(productId);
      })
    );
  }

  // Product Page - Add to Cart click
  if (productPageAddButton) {
    productPageAddButton.addEventListener("click", () => {
      onAddToCart("{{product.id}}");
    });
  }

  // Remove from Cart click
  if (cartPageRemoveButton.length > 0) {
    cartPageRemoveButton.forEach((el) =>
      el.addEventListener("click", () => {
        onRemoveFromCart(el.attributes[1].nodeValue);
      })
    );
  }
}

ready(".body", addProductEventListeners);

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

// Measure product/item list views/impressions
function onProductListView(products) {
  dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      items: products.map((item) => {
        var categoryArray = item.category.map((category, key) => ({
          [`item_category${key + 1}`]: category,
        }));

        var categories = Object.assign({}, ...categoryArray);

        return {
          item_name: item.name,
          item_id: item.id,
          price: item.price.without_tax.value,
          item_brand: item.brand.name,
          ...categories,
          item_list_name: "{{category.name}}",
          item_list_id: "{{category.id}}",
          index: 1,
          quantity: 1,
        };
      }),
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

// Call this function when a user clicks on a product link
function onProductClick(productName) {
  dataLayer.push({
    event: "select_item",
    ecommerce: {
      items: [
        {
          item_name: productName,
        },
      ],
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

// Measure a view of product details. This example assumes the detail view occurs on pageload,
function onProductDetailsView() {
  dataLayer.push({
    event: "view_item",
    ecommerce: {
      items: [
        {
          item_name: "{{product.title}}", // Name or ID is required.
          item_id: "{{product.id}}",
          price: "{{product.price.without_tax.value}}",
          item_category: "{{product.category}}",
          item_variant: "{{product.sku}}",
        },
      ],
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}


// This event signifies that a user viewed their cart.
function onViewCart() {
  dataLayer.push({
    event: "view_cart",
    ecommerce: {
      items: analyticsData.products,
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

// Measure when a product is added to a shopping cart
function onAddToCart(productId) {
  dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      items: [
        {
          item_name: "{{product.title}}", // Name or ID is required.
          item_id: productId,
          price: "{{product.price.without_tax.value}}",
          item_category: "{{product.category}}",
          item_variant: "{{product.sku}}",
        },
      ],
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

function onRemoveFromCart(cartItemId) {
  dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      cart_item_id: cartItemId,
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

function onCheckoutStarted() {
  dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      items: analyticsData.products,
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}

function onPurchase() {
  dataLayer.push({
    event: "purchase",
    ecommerce: {
      purchase: {
        products: analyticsData.products,
      },
    },
    shopper: {
      customer_id: analyticsData.userId,
      email: analyticsData.userId,
      externalCustomerId: analyticsData.userId,
    },
  });
}
