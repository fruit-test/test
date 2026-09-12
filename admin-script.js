// Local storage key
const STORAGE_KEY = 'jks_customers_data';

// Initialize
document.getElementById('uploadForm').addEventListener('submit', handleUpload);
loadCustomers();

// Handle file upload
function handleUpload(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const photoInput = document.getElementById('customerPhoto');
    const testimonial = document.getElementById('customerTestimonial').value;
    const status = document.getElementById('customerStatus').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    // Read image file
    const file = photoInput.files[0];
    if (!file) {
        alert('Please select a photo!');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit!');
        return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;

        // Get existing customers
        let customers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Add new customer
        customers.push({
            id: Date.now(),
            name: name,
            photo: photoData,
            testimonial: testimonial,
            status: status,
            rating: parseInt(rating),
            createdAt: new Date().toLocaleDateString()
        });

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));

        // Show success message
        alert(`✅ ${name} has been added successfully with ${rating} ⭐!`);

        // Reset form
        document.getElementById('uploadForm').reset();
        document.getElementById('star5').checked = true;

        // Reload customers list
        loadCustomers();
    };

    reader.readAsDataURL(file);
}

// Load and display customers
function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const customersList = document.getElementById('customersList');

    if (customers.length === 0) {
        customersList.innerHTML = '<div class="empty-state"><p>🎯 No customers added yet. Upload one above to get started!</p></div>';
        return;
    }

    customersList.innerHTML = customers.map(customer => `
        <div class="customer-card">
            <img src="${customer.photo}" alt="${customer.name}" class="customer-avatar-preview">
            <h3>${customer.name}</h3>
            <div class="stars" style="font-size: 1.5rem;">
                ${'⭐'.repeat(customer.rating)}${'☆'.repeat(5 - customer.rating)}
            </div>
            <span class="status">${customer.status}</span>
            <p class="testimonial">"${customer.testimonial}"</p>
            <small>Added: ${customer.createdAt}</small>
            <div class="card-actions">
                <button class="btn-delete" onclick="deleteCustomer(${customer.id})">🗑️ Delete</button>
                <button class="btn-edit" onclick="editCustomer(${customer.id})">✏️ Edit</button>
            </div>
        </div>
    `).join('');
}

// Delete customer
function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

    let customers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const customerToDelete = customers.find(c => c.id === id);
    
    customers = customers.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));

    alert(`✅ ${customerToDelete.name} has been deleted!`);
    loadCustomers();
}

// Edit customer (optional future feature)
function editCustomer(id) {
    alert('Edit feature coming soon! For now, you can delete and re-add the customer.');
}

// Export data
function exportData() {
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (customers.length === 0) {
        alert('⚠️ No customers to export!');
        return;
    }
    
    const dataStr = JSON.stringify(customers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jks-customers-backup.json';
    link.click();
    alert('✅ Data exported! Saved as jks-customers-backup.json');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!Array.isArray(data)) {
                    alert('❌ Invalid file format. Please import a valid backup file.');
                    return;
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                alert(`✅ Data imported successfully! ${data.length} customer(s) loaded.`);
                loadCustomers();
            } catch (error) {
                alert('❌ Error importing file. Make sure it\'s a valid backup file.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Clear all customers
function clearAllCustomers() {
    if (!confirm('⚠️ WARNING: This will delete ALL customers! Are you absolutely sure?')) return;
    if (!confirm('🚨 This action CANNOT be undone. Delete all customers?')) return;
    
    localStorage.removeItem(STORAGE_KEY);
    alert('✅ All customers have been cleared!');
    loadCustomers();
}

console.log('🍓 Admin panel loaded successfully!');
