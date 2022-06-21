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
    let name = '{{customer.name}}';
    name = name.split(" ");
    return clean({
      customer_id: '{{customer.id}}',
      email: '{{customer.email}}',
      first_name: name[0],
      last_name: name[1],
    });
  }

  function getItems() {
    var items = [];
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

  function pushDataLayer(event, items) {
    dataLayer.push({
        event: event,
        ecommerce: {
            items: items
        }
    });
  }

  if (pageType == 'category') {
    pushDataLayer('view_item_list', getItems());
  }
  else if (pageType === 'product') {
    pushDataLayer('view_item', [getItem()]);
    }

  window.eecGetShopper = getShopper;
  window.eecGetItems = getItems;
  window.eecGetItem = getItem;
  window.eecPushDataLayer = pushDataLayer;
  window.eecHtmlDecode = htmlDecode;
  window.eecClean = clean;

  dataLayer['eec'] = {};

  //{{#or (if category.products) (if products.new) (if products.featured) (if products.top_sellers)}}
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
})
();