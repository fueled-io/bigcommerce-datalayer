(function () {

  var dataLayer = {};
  if (window.dataLayer) {
    window.dataLayer['eec'] = dataLayer;
  } else {
    window.dataLayer = {'eec': dataLayer};
  }

  function clean(obj) {
    for (var propName in obj) {
      if (!obj[propName] || obj[propName].length === 0) {
        delete obj[propName];
      } else if (typeof obj[propName] === 'object') {
        clean(obj[propName]);
      }
    }
    return obj;
  }

  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
  }

  function setCustomer() {
    let name = '{{customer.name}}';
    name = name.split(" ");
    dataLayer['customer'] = clean({
      customer_id: '{{customer.id}}',
      email: '{{customer.email}}',
      first_name: name[0],
      last_name: name[1],
    });
  }

  function setProducts() {
    dataLayer['items'] = [];

//    {{#each this}}
//      {{#or (if @key '===' "products") (if @key '===' "category")}}
//        {{#each this}}
//          {{#or (if @key '===' "new") (if @key '===' "featured") (if @key '===' "products") (if @key '===' "category")}}
//            {{#each this}}
                var item = clean({
                  item_name: htmlDecode('{{name}}'),
                  item_id: '{{id}}',
                  sku: '{{sku}}',
                  price: parseFloat('{{price.without_tax.value}}'),
                  item_brand: htmlDecode('{{brand.name}}'),
                  item_url: htmlDecode('{{url}}'),
                  item_image_url: htmlDecode('{{image.data}}'),
                  item_list_name: htmlDecode('{{../category.name}}'),
                  item_list_id: '{{../category.id}}'
                });

                //{{#each category}}
                var index = parseInt('{{@index}}');
                item[index == 0 ? 'item_category' : `item_category${index} + 1`] = htmlDecode('{{this}}');
                //{{/each}}
                dataLayer['items'].push(item);
//             {{/each}}
//          {{/or}}
//       {{/each}}
//    {{/or}}
//  {{/each}}
  }

  function setProduct() {
    dataLayer['item'] = {
      item_name: htmlDecode('{{product.title}}'), // Name or ID is required.
      item_id: '{{product.id}}',
      price: parseFloat('{{product.price.without_tax.value}}'),
      sku: '{{product.sku}}',
      item_url: htmlDecode('{{product.url}}'),
      item_image_url: htmlDecode('{{product.main_image.data}}'),
    }

    //{{#each product.category}}
      var index = parseInt('{{@index}}');
      dataLayer['item'][index == 0 ? 'item_category' : `item_category${index} + 1`] = htmlDecode('{{this}}');
    //{{/each}}
  }

  /*
  Checkout Started Events
  */

  //{{#if cart_id}}
  dataLayer['cart_id'] = '{{ cart_id }}';
  //{{/if}}

  //{{#or (if category.products) (if products.new) (if products.featured) (if products.top_sellers)}}
  setProducts();
  //{{/or}}

  //{{#if product}}
  setProduct();
  //{{/if}}

  //{{#if customer}}
  setCustomer();
  //{{/if}}

  //{{#if category.id}}
  dataLayer['item_list_id'] = '{{category.id}}';
  //{{/if}}

  //{{#if category.name}}
  dataLayer['item_list_name'] = htmlDecode('{{category.name}}');
  //{{/if}}
})
();