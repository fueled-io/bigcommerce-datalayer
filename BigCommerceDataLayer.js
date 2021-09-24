// dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.

if (!window.dataLayer) window.dataLayer = [];
var dataLayer = window.dataLayer;

function htmlDecode(input) {
  var parsedInput = input.replace(/(\r\n|\n|\r)/gm, "");
  var doc = new DOMParser().parseFromString(parsedInput, "text/html");
  return JSON.parse(doc.documentElement.textContent);
} 


var pageType = "{{page_type}}";
var categoryProducts = "{{json category.products}}";
var cartProducts = "{{json cart.items}}";
var userEmail = "{{cutomer.email}}" || null;

function addProductEventListeners() {  
  var productDetailsButton = document.getElementsByClassName("card-figure__link") || [];
  var mainPageAddButton = document.querySelectorAll("[data-button-type='add-cart']") || [];
  var productPageAddButton = document.getElementById("form-action-addToCart");
  var cartPageRemoveButton = document.getElementsByClassName("cart-remove") || [];

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


if (pageType === "category") {
  onProductListView(htmlDecode(categoryProducts));
} else if (pageType === "product") {
  onProductDetailsView();
} else if (pageType === "checkout") {
  onCheckoutStarted();
}



// Measure product/item list views/impressions
function onProductListView(products) {
  dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      items: products.map((item, key) => {
        var categoryArray = item.category.map((category, key) => ({
          [`item_category${key + 1}`]: category
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
          quantity: 1
        };
      })
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
  });
}

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
  });
}

function onRemoveFromCart(cartItemId) {
  dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      cart_item_id: cartItemId         
      // items: [ {         
      //   },
      // ],
    },
  });
}

function onCheckoutStarted() {
  dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      checkout_id: "{{checkout.id}}",
      // items: [{
      //   item_name: "Donut Friday Scented T-Shirt", // Name or ID is required.
      //   item_id: "67890",
      //   price: 33.75,
      //   item_brand: "Google",
      //   item_category: "Apparel",
      //   item_category2: "Mens",
      //   item_category3: "Shirts",
      //   item_category4: "Tshirts",
      //   item_variant: "Black",
      //   item_list_name: "Search Results",
      //   item_list_id: "SR123",
      //   index: 1,
      //   quantity: 1
      // }]
    }
  });
}

function onPurchase() {
  dataLayer.push({
    event: "purchase",
    ecommerce: {
        order_id: "{{checkout.order.id}}",
        // items: [{
        //   item_name: "Triblend Android T-Shirt",
        //   item_id: "12345",
        //   price: "15.25",
        //   item_brand: "Google",
        //   item_category: "Apparel",
        //   item_variant: "Gray",
        //   quantity: 1
        // }]
    }
  });
}