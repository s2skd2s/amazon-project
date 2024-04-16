export const cart = JSON.parse(localStorage.getItem('cart')) || [];

console.log(cart);

export function addToCart(productId, productName){
    let matchingItem;
    let quantityInput = Number(document.querySelector(`.js-selector-quantity-${productId}`).value);


    cart.forEach((item) =>{
        if(productId === item.id){
            matchingItem = item;
        }
    })

    if(!matchingItem){
        cart.push({
            name: productName,
            id: productId,
            quantity: quantityInput
        })
    }else{
        matchingItem.quantity += quantityInput;
    } 
}



export function updateCartQuantity(){
    let cartIcon = document.querySelector('.js-cart-quantity');
    cartIcon.innerHTML = cart.length;
}

export function saveCartToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}