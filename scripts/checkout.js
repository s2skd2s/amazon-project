import {cart, removeFromCart, updateQuantity} from '../data/cart.js'
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

updateCheckoutQuantity();
renderCheckoutHTML();





function renderCheckoutHTML(){
    let checkoutHTML = ``;
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
            HTML = `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                    Delivery date: Tuesday, June 21
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
                        <div class="delivery-option">
                        <input type="radio" checked
                            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="delivery-option-date">
                            Tuesday, June 21
                            </div>
                            <div class="delivery-option-price">
                            FREE Shipping
                            </div>
                        </div>
                        </div>
                        <div class="delivery-option">
                        <input type="radio"
                            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="delivery-option-date">
                            Wednesday, June 15
                            </div>
                            <div class="delivery-option-price">
                            $4.99 - Shipping
                            </div>
                        </div>
                        </div>
                        <div class="delivery-option">
                        <input type="radio"
                            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                        <div>
                            <div class="delivery-option-date">
                            Monday, June 13
                            </div>
                            <div class="delivery-option-price">
                            $9.99 - Shipping
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            `;
        }
    
        checkoutHTML += HTML;
        
    })
    document.querySelector('.order-summary').innerHTML = checkoutHTML;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () =>{

            const productId = link.dataset.productId;
            removeFromCart(productId);
            renderCheckoutHTML();
            updateCheckoutQuantity();

        })
    })

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId;
            // renderCheckoutHTML();
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
              );
            container.classList.add('is-editing-quantity');

            document.querySelector(`.js-quantity-input-${productId}`).addEventListener('keypress',() =>{
                if(event.code === 'Enter'){
                    const productId = link.dataset.productId;
                // renderCheckoutHTML();
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
            // renderCheckoutHTML();
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


}

function updateCheckoutQuantity(){
    document.querySelector(".return-to-home-link").innerHTML = `${cart.length} items`;
}
