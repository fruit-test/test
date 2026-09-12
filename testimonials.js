// Load and display customer testimonials from admin panel
function loadTestimonials() {
    const customers = JSON.parse(localStorage.getItem('jks_customers_data') || '[]');
    const testimonialsGrid = document.getElementById('testimonialsGrid');

    if (customers.length === 0) {
        // Keep default testimonials
        return;
    }

    // Add customer testimonials at the beginning
    const customerCards = customers.map(customer => `
        <div class="testimonial-card">
            <div class="customer-avatar">
                <img src="${customer.photo}" alt="${customer.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"${customer.testimonial}"</p>
            <h4>${customer.name}</h4>
            <span>Trusted Customer • ${customer.status}</span>
        </div>
    `).join('');

    // Prepend customer cards to the grid
    testimonialsGrid.innerHTML = customerCards + testimonialsGrid.innerHTML;
}

// Load testimonials when page loads
document.addEventListener('DOMContentLoaded', loadTestimonials);

console.log('🍓 Testimonials system loaded!');
