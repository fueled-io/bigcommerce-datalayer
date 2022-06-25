(function () {

  var dataLayer = window.dataLayer || [];
  if (!window.dataLayer)
    window.dataLayer = dataLayer;

  var pageType = '{{page_type}}';

  function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName].length === 0 || obj[propName] === '') {
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

  function getShopper() {
    return clean({
      customer_id: '{{customer.id}}',
      email: '{{customer.email}}',
      name: '{{customer.name}}',
      phone: '{{customer.phone}}',
//    {{#if customer.shipping_address}}
          shipping_address: {
            address1: '{{customer.shipping_address.address1}}',
            address2: '{{customer.shipping_address.address2}}',
            city: '{{customer.shipping_address.city}}',
            company: '{{customer.shipping_address.company}}',
            country: '{{customer.shipping_address.country}}',
            first_name: '{{customer.shipping_address.first_name}}',
            last_name: '{{customer.shipping_address.last_name}}',
            address_id: '{{customer.shipping_address.id}}',
            phone: '{{customer.shipping_address.phone}}',
            state: '{{customer.shipping_address.state}}',
            zip: '{{customer.shipping_address.zip}}',
          }
//    {{/if}}
    });
  }

  function getItems() {
    var items = [];
//    {{#each this}}
//      {{#or (if @key '===' "products") (if @key '===' "category") (if @key '===' "cart") (if @key '===' "product_results")}}
//        {{#each this}}
//          {{#or (if @key '===' "new") (if @key '===' "featured") (if @key '===' "products") (if @key '===' "category") (if @key '===' "items")}}
//            {{#each this}}
                var item = clean({
                  item_name: htmlDecode('{{name}}'),
                  item_id: '{{product_id}}' ? '{{product_id}}' : '{{id}}',
                  sku: '{{sku}}',
                  price: "{{price.value}}" ? parseFloat('{{price.value}}') : parseFloat('{{price.without_tax.value}}'),
                  item_brand: htmlDecode('{{brand.name}}'),
                  item_url: htmlDecode('{{url}}'),
                  item_image_url: htmlDecode('{{image.data}}'),
                  item_list_name: htmlDecode('{{../category.name}}'),
                  item_list_id: '{{../category.id}}',
                  quantity: '{{quantity}}' ? parseInt('{{quantity}}') : undefined
                });



                //{{#each category}}
                var index = parseInt('{{@index}}');
                item[index == 0 ? 'item_category' : `item_category${index} + 1`] = htmlDecode('{{this}}');
                //{{/each}}
                items.push(item);
//             {{/each}}
//          {{/or}}
//       {{/each}}
//    {{/or}}
//  {{/each}}
    return items;
  }

  function getItem() {
    var item = {
      item_name: htmlDecode('{{product.title}}'), // Name or ID is required.
      item_id: '{{product.id}}',
      price: parseFloat('{{product.price.without_tax.value}}'),
      sku: '{{product.sku}}',
      item_url: htmlDecode('{{product.url}}'),
      item_image_url: htmlDecode('{{product.main_image.data}}'),
    }

    //{{#each product.category}}
      var index = parseInt('{{@index}}');
      item[index == 0 ? 'item_category' : `item_category${index} + 1`] = htmlDecode('{{this}}');
    //{{/each}}

    return item;
  }

  function pushDataLayerEcommerce(event, items) {
    dataLayer.push({
        event: event,
        ecommerce: {
            items: items
        }
    });
  }

  if (pageType === 'category') {
    pushDataLayerEcommerce('view_item_list', getItems());
  }
  else if (pageType === 'product') {
    pushDataLayerEcommerce('view_item', [getItem()]);
    } else if (pageType === 'search') {
        dataLayer.push({
        event: 'search',
        search_term: '{{forms.search.query}}'
    });
  }

  window.eecGetShopper = getShopper;
  window.eecGetItems = getItems;
  window.eecGetItem = getItem;
  window.eecHtmlDecode = htmlDecode;
  window.eecClean = clean;

  dataLayer['eec'] = {};

  //{{#or (if category.products) (if products.new) (if products.featured) (if products.top_sellers) (if cart.items) (if product_results.products)}}
  dataLayer['eec']['items'] = getItems();
  //{{/or}}

  //{{#if product}}
  dataLayer['eec']['item'] = getItem();
  //{{/if}}

  //{{#if cart_id}}
  dataLayer['eec']['cart_id'] = '{{ cart_id }}';
  //{{/if}}

  //{{#if customer}}
  dataLayer['eec']['shopper'] = getShopper();
  //{{/if}}

  //{{#if category.id}}
  dataLayer['eec']['item_list_id'] = '{{category.id}}';
  //{{/if}}

  //{{#if category.name}}
  dataLayer['eec']['item_list_name'] = htmlDecode('{{category.name}}');
  //{{/if}}

  //{{#if forms.search.query}}
  dataLayer['eec']['search_query'] = htmlDecode('{{forms.search.query}}');
  //{{/if}}

})
();