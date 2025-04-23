// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {    
    // Ensure all elements exist before accessing them
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    
    // console.log('Menu button:', menuButton);
    // console.log('Mobile menu:', mobileMenu);
    // console.log('Close button:', closeMenuBtn);
    // console.log('Overlay:', overlay);
    
    if (!menuButton || !mobileMenu || !closeMenuBtn || !overlay) {
        console.error('One or more menu elements not found');
        return;
    }
    
    // Function to open the menu
    function openMenu() {
        console.log('Opening menu');
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        overlay.classList.add('opacity-50');
        overlay.classList.remove('pointer-events-none');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }
    
    // Function to close the menu
    function closeMenu() {
        console.log('Closing menu');
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        overlay.classList.remove('opacity-50');
        overlay.classList.add('pointer-events-none');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Event listeners
    menuButton.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when menu items are clicked
    const menuItems = document.querySelectorAll('#mobileMenu ul li a');
    menuItems.forEach(item => {
        item.addEventListener('click', closeMenu);
    });
    
    console.log('Mobile menu initialized');
});

// Captcha functionality
function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        captcha += chars[randomIndex];
    }
    return captcha;
}

const captchaBox = document.getElementById('captchaBox');
const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
let currentCaptcha = '';

function refreshCaptcha() {
    currentCaptcha = generateCaptcha();
    captchaBox.textContent = currentCaptcha;
}

// Initialize captcha on page load
document.addEventListener('DOMContentLoaded', refreshCaptcha);

// Refresh captcha when button is clicked
refreshCaptchaBtn.addEventListener('click', refreshCaptcha);

// Form submission handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const captchaInput = document.getElementById('captchaInput').value;
    
    if (captchaInput !== currentCaptcha) {
        formMessage.textContent = 'Incorrect captcha code. Please try again.';
        formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        formMessage.classList.add('bg-red-100', 'text-red-700');
        return;
    }
    
    // Form is valid, now submit to Formspree
    const formData = new FormData(contactForm);
    
    fetch('https://formspree.io/f/mblgwneg', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Show success message
        formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
        formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        formMessage.classList.add('bg-green-100', 'text-green-700');
        
        // Reset form
        contactForm.reset();
        refreshCaptcha();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    })
    .catch(error => {
        console.error('Error:', error);
        formMessage.textContent = "Oops! Something went wrong. Please try again later.";
        formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        formMessage.classList.add('bg-red-100', 'text-red-700');
    });
});