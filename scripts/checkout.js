import {cart, removeFromCart, updateQuantity, updateDeliveryOptionIdToCart} from '../data/cart.js'
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

renderOrderSummaryHTML();





function renderOrderSummaryHTML(){
    updateCheckoutQuantity();

    let OrderSummaryHTML = ``;
    cart.forEach((item) => {
        let matchingProduct;
        let HTML;
        products.forEach((product) => {
            let productId = product.id;
            if (productId === item.id){
                matchingProduct = product;
            } 
        })


        if(matchingProduct){
            let today = dayjs();
            let deliveryDate;
            deliveryOptions.forEach((deliveryOption) => {
                if(deliveryOption.id === item.deliveryOptionId){
                    deliveryDate = today.add(deliveryOption.deliveryDays, 'day').format("dddd, MMMM D")
                }
            })
            
            HTML = `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                    Delivery date:  ${(!deliveryDate) ? '' : deliveryDate}
                    </div>
    
                    <div class="cart-item-details-grid">
                        <img class="product-image"
                            src="${matchingProduct.image}">
        
                        <div class="cart-item-details">
                            <div class="product-name">
                            ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                            $${formatCurrency(matchingProduct.priceCents)}
                            </div>
                            <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${item.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-link" data-product-id ="${matchingProduct.id}">
                                Update
                            </span>
                            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>

                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id ="${matchingProduct.id}">
                                Delete
                            </span>
                            </div>
                        </div>
        
                        <div class="delivery-options">
                            <div class="delivery-options-title">
                            Choose a delivery option:
                            </div>

                            ${deliveryOptionsHTML(matchingProduct.id,item)}
                        </div>
                    </div>
                </div>
            `;
        }
    
        OrderSummaryHTML += HTML;

        
    
        
    })
    document.querySelector('.order-summary').innerHTML = OrderSummaryHTML;
    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () =>{

            const productId = link.dataset.productId;
            removeFromCart(productId);
            
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            
            container.classList.add("isRemoved");

            updateCheckoutQuantity();

        })
    })

    function deliveryOptionsHTML(productId, cartItem){
        let html = '';
        let today = dayjs();
        
        deliveryOptions.forEach((deliveryOption)=>{
            let today = dayjs();
            let deliveryDate = today.add(deliveryOption.deliveryDays,'day').format("dddd, MMMM D - YYYY");
            let isChecked = (deliveryOption.id == cartItem.deliveryOptionId ? 'checked' : '')
            let priceString = (deliveryOption.priceCents === 0) 
                            ? "Free shipping" : "$" + formatCurrency(deliveryOption.priceCents);
            html += `
                <div class="delivery-option js-delivery-option"
                    data-product-id=${productId} data-delivery-option-id=${deliveryOption.id}>
                    <input type="radio" ${isChecked}
                        class="delivery-option-input"
                        name="delivery-option-${productId}">
                    <div>
                        <div class="delivery-option-date">
                            ${deliveryDate}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString}
                        </div>
                    </div>
                </div>
            `
        })
        return html;
    }

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId;
            // renderOrderSummaryHTML();
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.add('is-editing-quantity');

            document.querySelector(`.js-quantity-input-${productId}`).addEventListener('keypress',() =>{
                if(event.code === 'Enter'){
                    const productId = link.dataset.productId;
                // renderOrderSummaryHTML();
                    const container = document.querySelector(
                        `.js-cart-item-container-${productId}`
                    );
                    container.classList.remove('is-editing-quantity');
        
                    const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
                    if (newQuantity <= 0){
                        alert('Quantity has to be more than 0.');
                        return;
                    }
                    updateQuantity(productId, newQuantity);
                    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
                }
            })
        })
    })






    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId;
            // renderOrderSummaryHTML();
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.classList.remove('is-editing-quantity');

            const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
            if (newQuantity <= 0){
                alert('Quantity has to be more than 0.');
                return;
            }
            updateQuantity(productId, newQuantity);
            document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
        })
    })


    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
        let deliveryOptionId = element.dataset.deliveryOptionId;
        let productId = element.dataset.productId;
        // console.log(element.dataset)
        element.addEventListener('click', () => {
            updateDeliveryOptionIdToCart(deliveryOptionId, productId);
            renderOrderSummaryHTML();
        })
    })
    



    function updateCheckoutQuantity(){
        document.querySelector(".return-to-home-link").innerHTML = `${cart.length} items`;
    }
}






