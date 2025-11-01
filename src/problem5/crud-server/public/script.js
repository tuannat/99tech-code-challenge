class ResourceManager {
    constructor() {
        this.baseURL = '/api/resources';
        this.currentPage = 0;
        this.pageSize = 12;
        this.filters = {};
        this.categories = new Set();
        this.isInitialized = false;
        
        this.initializeEventListeners();
        this.initialize();
    }

    async initialize() {
        console.log('ResourceManager: Initializing...');
        try {
            await this.loadResources();
            this.isInitialized = true;
            console.log('ResourceManager: Initialization complete');
        } catch (error) {
            console.error('ResourceManager: Failed to initialize:', error);
            this.showToast('Failed to load resources. Please refresh the page.', 'error');
        }
    }

    initializeEventListeners() {
        // Create form
        document.getElementById('createForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createResource();
        });

        // Edit form
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateResource();
        });

        // Filter controls
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.debounce(() => this.loadResources(), 300)();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.loadResources();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.loadResources();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadResources();
        });

        // Modal controls
        document.querySelectorAll('.close, .close-modal').forEach(el => {
            el.addEventListener('click', () => this.closeModal());
        });

        // Close modal on outside click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });

        // Delegated event listeners for dynamically created elements
        document.addEventListener('click', (e) => {
            // Handle resource action buttons
            if (e.target.closest('[data-action]')) {
                const button = e.target.closest('[data-action]');
                const action = button.getAttribute('data-action');
                const resourceId = parseInt(button.getAttribute('data-resource-id'));
                
                if (action === 'edit') {
                    this.editResource(resourceId);
                } else if (action === 'delete') {
                    this.deleteResource(resourceId);
                }
            }
            
            // Handle pagination buttons
            if (e.target.closest('.pagination-btn') && !e.target.closest('.pagination-btn').disabled) {
                const button = e.target.closest('.pagination-btn');
                const page = parseInt(button.getAttribute('data-page'));
                this.changePage(page);
            }
        });
    }

    async apiCall(url, options = {}) {
        this.showLoading();
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    async createResource() {
        const form = document.getElementById('createForm');
        const formData = new FormData(form);
        
        const resource = {
            name: formData.get('name').trim(),
            description: formData.get('description').trim(),
            category: formData.get('category').trim(),
            status: formData.get('status')
        };

        // Client-side validation
        const validationError = this.validateResource(resource);
        if (validationError) {
            this.showToast(validationError, 'error');
            return;
        }

        try {
            await this.apiCall(this.baseURL, {
                method: 'POST',
                body: JSON.stringify(resource)
            });

            this.showToast('Resource created successfully!', 'success');
            form.reset();
            this.loadResources();
        } catch (error) {
            console.error('Error creating resource:', error);
        }
    }

    async loadResources() {
        const params = new URLSearchParams({
            limit: this.pageSize,
            offset: this.currentPage * this.pageSize,
            ...this.filters
        });

        // Remove empty filter values
        for (const [key, value] of params.entries()) {
            if (!value) params.delete(key);
        }

        const url = `${this.baseURL}?${params}`;
        console.log('ResourceManager: Loading resources from:', url);

        try {
            const response = await this.apiCall(url);
            console.log('ResourceManager: Loaded', response.data.length, 'resources');
            
            this.renderResources(response.data);
            this.renderPagination(response.pagination);
            this.updateCategoryFilter(response.data);
        } catch (error) {
            console.error('ResourceManager: Error loading resources:', error);
            this.renderEmptyState();
            
            // Show error message to user
            if (!this.isInitialized) {
                this.showToast('Failed to connect to the API. Please check if the server is running.', 'error');
            }
        }
    }

    renderResources(resources) {
        const container = document.getElementById('resourcesList');
        console.log('ResourceManager: Rendering', resources.length, 'resources');
        
        if (!container) {
            console.error('ResourceManager: resourcesList container not found!');
            return;
        }
        
        if (resources.length === 0) {
            console.log('ResourceManager: No resources to display, showing empty state');
            this.renderEmptyState();
            return;
        }

        container.innerHTML = resources.map(resource => `
            <div class="resource-card">
                <div class="resource-header">
                    <h3 class="resource-name">${this.escapeHtml(resource.name)}</h3>
                    <span class="resource-status status-${resource.status}">${resource.status}</span>
                </div>
                <p class="resource-description">${this.escapeHtml(resource.description)}</p>
                <div class="resource-meta">
                    <span><strong>Category:</strong> ${this.escapeHtml(resource.category)}</span>
                    <span><strong>ID:</strong> ${resource.id}</span>
                </div>
                <div class="resource-meta">
                    <span><strong>Created:</strong> ${this.formatDate(resource.createdAt)}</span>
                    <span><strong>Updated:</strong> ${this.formatDate(resource.updatedAt)}</span>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-edit" data-action="edit" data-resource-id="${resource.id}">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger" data-action="delete" data-resource-id="${resource.id}">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log('ResourceManager: Successfully rendered', resources.length, 'resource cards');
    }

    renderEmptyState() {
        const container = document.getElementById('resourcesList');
        container.innerHTML = `
            <div class="empty-state">
                <h3>No resources found</h3>
                <p>Try adjusting your filters or create a new resource.</p>
            </div>
        `;
    }

    renderPagination(pagination) {
        const container = document.getElementById('pagination');
        const { total, limit, offset, hasMore } = pagination;
        const currentPage = Math.floor(offset / limit);
        const totalPages = Math.ceil(total / limit);

        container.innerHTML = `
            <button class="btn btn-secondary pagination-btn" 
                    data-page="${currentPage - 1}" 
                    ${currentPage === 0 ? 'disabled' : ''}>
                ← Previous
            </button>
            <span class="pagination-info">
                Page ${currentPage + 1} of ${totalPages} (${total} total)
            </span>
            <button class="btn btn-secondary pagination-btn" 
                    data-page="${currentPage + 1}" 
                    ${!hasMore ? 'disabled' : ''}>
                Next →
            </button>
        `;
    }

    updateCategoryFilter(resources) {
        resources.forEach(resource => {
            this.categories.add(resource.category);
        });

        const select = document.getElementById('categoryFilter');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">All Categories</option>' +
            Array.from(this.categories).sort().map(category => 
                `<option value="${this.escapeHtml(category)}">${this.escapeHtml(category)}</option>`
            ).join('');
        
        select.value = currentValue;
    }

    async editResource(id) {
        try {
            const response = await this.apiCall(`${this.baseURL}/${id}`);
            const resource = response.data;

            document.getElementById('editId').value = resource.id;
            document.getElementById('editName').value = resource.name;
            document.getElementById('editDescription').value = resource.description;
            document.getElementById('editCategory').value = resource.category;
            document.getElementById('editStatus').value = resource.status;

            this.showModal();
        } catch (error) {
            console.error('Error loading resource for edit:', error);
        }
    }

    async updateResource() {
        const id = document.getElementById('editId').value;
        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        
        const resource = {
            name: formData.get('name').trim(),
            description: formData.get('description').trim(),
            category: formData.get('category').trim(),
            status: formData.get('status')
        };

        // Client-side validation
        const validationError = this.validateResource(resource);
        if (validationError) {
            this.showToast(validationError, 'error');
            return;
        }

        try {
            await this.apiCall(`${this.baseURL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(resource)
            });

            this.showToast('Resource updated successfully!', 'success');
            this.closeModal();
            this.loadResources();
        } catch (error) {
            console.error('Error updating resource:', error);
        }
    }

    async deleteResource(id) {
        if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
            return;
        }

        try {
            await this.apiCall(`${this.baseURL}/${id}`, {
                method: 'DELETE'
            });

            this.showToast('Resource deleted successfully!', 'success');
            this.loadResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    }

    changePage(page) {
        if (page < 0) return;
        this.currentPage = page;
        this.loadResources();
    }

    clearFilters() {
        this.filters = {};
        this.currentPage = 0;
        
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('statusFilter').value = '';
        
        this.loadResources();
    }

    showModal() {
        document.getElementById('editModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    validateResource(resource) {
        if (!resource.name || resource.name.length === 0) {
            return 'Name is required';
        }
        if (resource.name.length > 255) {
            return 'Name must be less than 255 characters';
        }
        
        if (!resource.description || resource.description.length === 0) {
            return 'Description is required';
        }
        if (resource.description.length > 1000) {
            return 'Description must be less than 1000 characters';
        }
        
        if (!resource.category || resource.category.length === 0) {
            return 'Category is required';
        }
        if (resource.category.length > 100) {
            return 'Category must be less than 100 characters';
        }
        
        return null; // No validation errors
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the app when DOM is loaded
function initializeApp() {
    console.log('Initializing ResourceManager app...');
    window.app = new ResourceManager();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

// Handle API connection errors
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (event.reason.message.includes('fetch')) {
        document.getElementById('toast').textContent = 'Unable to connect to server. Please check if the API is running.';
        document.getElementById('toast').className = 'toast error show';
        
        setTimeout(() => {
            document.getElementById('toast').classList.remove('show');
        }, 5000);
    }
});