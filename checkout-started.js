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
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}

getData()
    .then(data => {
        if (data.cart.lineItems.physicalItems.length) {
            for (const product of data.cart.lineItems.physicalItems) {
                products.push(
                    {
                        product_id: product.productId,
                        sku: product.sku,
                        name: product.name,
                        brand: product.brand,
                        price: product.salePrice,
                        quantity: product.quantity,
                        url: product.url,
                        image_url: product.imageUrl,
                    }
                );
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
            }
        } 
    }
);

ready('.customerView-body', function() {
    if (mailSelector && mailSelector[0]) {
        console.log(1)
        userEmail = mailSelector[0].innerHTML;
        analyticsData.userId = userEmail;
    }

    // if (localStorage.getItem('segmentCheckoutStepCompleted') == 0) {

        analyticsData.step = 1;

        analytics.track('Checkout Step Completed', {
            ...analyticsData
        });

        analytics.identify(userEmail, {
            email: userEmail,
        });

        // localStorage.setItem('segmentCheckoutStepCompleted', 1);
    // }
});


ready('.checkout-step--payment', function() {
    // if (localStorage.getItem('segmentCheckoutStarted') == 0) {
        if (checkoutId) {
            analytics.track('Checkout Started', {
                ...analyticsData
            });
            
            // localStorage.setItem('segmentCheckoutStarted', 1);
        }
    // }
});