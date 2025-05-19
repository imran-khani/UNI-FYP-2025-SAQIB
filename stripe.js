// Stripe Integration for Checkout

document.addEventListener('DOMContentLoaded', function() {
  // Test Stripe publishable key - this is a test key and safe to include in client code
  const stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
  
  // Initialize Stripe with the public key
  const stripe = Stripe(stripePublicKey);
  const elements = stripe.elements();
  
  // Custom styling for the Stripe card element
  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };
  
  // Create and mount the Card Element
  const cardElement = elements.create('card', {style: style});
  cardElement.mount('#card-element');
  
  // Handle real-time validation errors
  cardElement.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
      displayError.style.display = 'block';
    } else {
      displayError.textContent = '';
      displayError.style.display = 'none';
    }
  });
  
  // Get cart items from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Render checkout items and calculate totals
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const checkoutSubtotalElement = document.getElementById('checkout-subtotal');
  const checkoutTotalElement = document.getElementById('checkout-total');
  
  let subtotal = 0;
  const shippingCost = 150; // Fixed shipping cost
  
  // Check if cart is empty, redirect to cart page if it is
  if (cart.length === 0) {
    window.location.href = 'cart.html';
  }
  
  // Render each item in the cart
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'checkout-item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
      <div class="checkout-item-details">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-quantity">Quantity: ${item.quantity}</div>
        <div class="checkout-item-price">RS ${itemTotal.toFixed(2)}</div>
      </div>
    `;
    
    checkoutItemsContainer.appendChild(itemElement);
  });
  
  // Update totals
  const total = subtotal + shippingCost;
  checkoutSubtotalElement.textContent = `RS ${subtotal.toFixed(2)}`;
  checkoutTotalElement.textContent = `RS ${total.toFixed(2)}`;
  
  // Handle form submission
  const form = document.getElementById('shipping-form');
  const submitButton = document.getElementById('submit-button');
  const buttonText = document.getElementById('button-text');
  const spinner = document.getElementById('spinner');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    spinner.classList.remove('hidden');
    
    // Collect customer information
    const customerInfo = {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      postalCode: document.getElementById('postalCode').value
    };
    
    // In a real implementation, you would send this to your server to create a payment intent
    // Since this is a test implementation without a backend, we'll simulate the payment process
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      // Simulate a successful payment
      const orderNumber = generateOrderNumber();
      document.getElementById('order-number').textContent = orderNumber;
      
      // Clear the cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Hide loading state
      submitButton.disabled = false;
      buttonText.style.display = 'block';
      spinner.classList.add('hidden');
      
      // Save order to localStorage for history (in a real app this would go to a database)
      saveOrder(orderNumber, customerInfo, cart, total);
      
      // Show success modal
      const modal = document.getElementById('success-modal');
      modal.style.display = 'block';
    }, 2000); // 2 second delay to simulate payment processing
  });
  
  // Close modal when the X is clicked
  const closeModal = document.getElementById('close-modal');
  closeModal.addEventListener('click', function() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    
    // Redirect to shop page
    window.location.href = 'shop.html';
  });
  
  // Close modal when clicking outside of it
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('success-modal');
    if (event.target == modal) {
      modal.style.display = 'none';
      
      // Redirect to shop page
      window.location.href = 'shop.html';
    }
  });
  
  // Autofill form for logged in users
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    document.getElementById('fullName').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    
    // Hide the login reminder for logged in users
    const loginReminder = document.getElementById('login-reminder');
    if (loginReminder) {
      loginReminder.style.display = 'none';
    }
  }
});

// Helper functions

// Generate a random order number
function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
}

// Save order to localStorage
function saveOrder(orderNumber, customerInfo, items, total) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  const newOrder = {
    id: orderNumber,
    date: new Date().toISOString(),
    customer: customerInfo,
    items: items,
    total: total,
    status: 'Processing'
  };
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // If user is logged in, associate order with the user
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].orders = users[userIndex].orders || [];
      users[userIndex].orders.push(orderNumber);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}