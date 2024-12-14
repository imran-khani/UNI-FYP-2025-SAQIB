

// Script for navigation bar
const bar = document.querySelector("#bar");
const close = document.querySelector("#close");
const nav = document.querySelector("#navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// Cart management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update cart icon counter

function updateCartCounter() {
  const cartCounters = document.querySelectorAll('.cart-counter');
  if (cartCounters.length === 0) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check screen width
  const isMobileOrTablet = window.matchMedia("(max-width: 799px)").matches;
  
  cartCounters.forEach(cartCounter => {
    if (totalItems > 0) {
      if (isMobileOrTablet) {
        cartCounter.style.display = "flex";
        cartCounter.innerText = totalItems;
      } else {
        cartCounter.style.display = "flex";
        cartCounter.innerText = totalItems;
      }
    } else {
      
      cartCounter.style.display = "none";
    }
  });
}

// Add event listener for screen size changes
window.addEventListener('resize', updateCartCounter);

// Call initially to set correct state
updateCartCounter();



// function updateCartCounter() {
//   const cartCounter = document.querySelector(".cart-counter");
//   if (!cartCounter) return; // Exit if cart counter doesn't exist

//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   if (totalItems > 0) {
//     cartCounter.style.display = "flex";
//     cartCounter.innerText = totalItems;
//   } else {
//     cartCounter.style.display = "none";
//   }
// }

// Function to add items to cart
function addToCart(name, price, image) {
  let item = cart.find((i) => i.name === name);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1,
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();

  // Prevent page scroll to top
  if (window.event) {
    window.event.preventDefault();
  }
}

// Function to render cart items on cart page
function displayCart() {
  const cartContainer = document.querySelector("#cart-items");
  const totalAmount = document.querySelector("#total");
  const emptyMessageContainer = document.querySelector("#empty-message");

  // Check if we're on the cart page
  if (!cartContainer) return;

  let total = 0;
  cartContainer.innerHTML = ""; // Clear previous items

  if (cart.length === 0) {
    // Show the empty cart message
   emptyMessageContainer.innerHTML = `
    <div class="big-div-cart" style="
        max-width: 400px; 
        margin: 0 auto; 
        margin-top: 45px; 
        padding: 20px; 
        background-color: #fff; 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        display: flex; 
        flex-wrap: wrap; 
        align-items: center; 
        justify-content: center;
    ">
        <div style="margin-bottom: 20px;">
            <img src="img/cart/empty-cart.png" alt="Empty Cart" style="width: 200px; height: auto; margin: 0 auto;" />
        </div>
        <h2 style="font-family: Arial, sans-serif; font-size: 20px; color: #333; margin: 5px 0;">
            <span style="color: #FF6347">Opps!</span> Your cart is empty
        </h2>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #999; margin-bottom: 15px;">
            Add items now and fill your cart with things you'll love!
        </p>
        <a href="shop.html" style="text-decoration: none; display: inline-block; width: 100%;">
            <input
                type="button"
                value="Start Shopping Now"
                style="
                    width: 100%;
                    font-weight: 700; 
                    padding: 10px 15px; 
                    font-size: 16px; 
                    color: black; 
                    border: 1px solid rgb(0, 0, 0); 
                    background: none; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    transition: background 0.3s ease, color 0.3s ease;
                "
                onmouseover="this.style.background='#088178'; this.style.color='white';"
            >
        </a>
    </div>
    `;

    // Hide the total amount
    if (totalAmount) {
      totalAmount.style.display = "none";
      totalAmount.innerText = "";
    }
  } else {
    // Clear the empty cart message
    emptyMessageContainer.innerHTML = "";

    cart.forEach((item, index) => {
      let itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartContainer.innerHTML += `
      <div class="cart-item" style="display: flex; margin-bottom: 20px; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;" />
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Price: RS ${item.price}</p>
          <p>Quantity: 
            <button onclick="changeQuantity(${index}, -1)">-</button>
            ${item.quantity}
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </p>
          <!-- Added In Stock Button -->
          <button style="
            background-color: rgb(63, 182, 59); 
            color: white; 
            border: none; 
            border-radius: 20px; 
            padding: 8px 16px; 
            font-size: 14px; 
            font-weight: bold; 
            cursor:  text; 
            margin-top: 5px;" 
          >In Stock</button>
          <button style="
            background-color: rgb(231, 70, 70); 
            color: white; 
            border: none; 
            border-radius: 20px; 
            padding: 8px 16px; 
            font-size: 14px; 
            font-weight: bold; 
            cursor: pointer; 
            margin-top: 5px;" 
            onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
    
    });

    // Show total amount if cart is not empty
    if (totalAmount) {
      totalAmount.style.display = "block";
      totalAmount.innerText = `Total: RS ${total.toFixed(2)}`;
    }
  }
}

// Function to update quantity
function changeQuantity(index, change) {
  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
  } else {
    cart.splice(index, 1); // Remove if quantity goes to zero
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  displayCart();
}

// Function to remove an item
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  displayCart();
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  
  // Only call displayCart on cart page
  const cartContainer = document.querySelector("#cart-items");
  if (cartContainer) {
    displayCart();
  }
});
