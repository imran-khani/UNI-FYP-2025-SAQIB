// Authentication Functionality
document.addEventListener("DOMContentLoaded", function() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  updateNavigation(currentUser);
  
  // Registration Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorMsg = document.getElementById('register-error');
      
      // Basic validation
      if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match!";
        errorMsg.style.display = "block";
        return;
      }
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        errorMsg.textContent = "Email already registered. Please use a different email.";
        errorMsg.style.display = "block";
        return;
      }
      
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password // In a real app, this should be hashed
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }));
      
      // Redirect to profile page
      window.location.href = "profile.html";
    });
  }
  
  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorMsg = document.getElementById('login-error');
      
      // Check credentials
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        errorMsg.textContent = "Invalid email or password!";
        errorMsg.style.display = "block";
        return;
      }
      
      // Set current user (without password)
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));
      
      // Redirect to profile page
      window.location.href = "profile.html";
    });
  }
  
  // Logout Handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      window.location.href = "index.html";
    });
  }
  
  // Profile Page Handler
  if (window.location.pathname.includes('profile.html')) {
    if (!currentUser) {
      window.location.href = "login.html";
      return;
    }
    
    // Update profile information
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-greeting').textContent = `#welcome_${currentUser.name.split(' ')[0]}`;
  }
  
  // Protect profile page
  if (window.location.pathname.includes('profile.html') && !currentUser) {
    window.location.href = "login.html";
  }
  
  // If user is logged in, redirect from login/register to profile
  if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) && currentUser) {
    window.location.href = "profile.html";
  }
});

// Update navigation based on login status
function updateNavigation(currentUser) {
  const accountNav = document.getElementById('account-nav');
  
  if (accountNav) {
    if (currentUser) {
      // User is logged in
      accountNav.querySelector('a').href = "profile.html";
      
      // Add username to the profile icon on hover
      accountNav.querySelector('a').title = `${currentUser.name}'s Profile`;
    } else {
      // User is not logged in
      accountNav.querySelector('a').href = "login.html";
      accountNav.querySelector('a').title = "Login";
    }
  }
}
