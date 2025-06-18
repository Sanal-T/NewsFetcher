// NewsAPI Configuration
const NEWS_API_KEY = 'e9b0bf3cc96f4da6bf56cc3a4a874eeb';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/top-headlines';
const COUNTRY_CODE = 'us'; // India

let currentCategory = 'general';

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createNewsCard(article) {
    // Handle missing images
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200/667eea/white?text=News+Image';
    
    // Truncate description if too long
    const description = article.description && article.description.length > 150 
        ? article.description.substring(0, 150) + '...' 
        : article.description || 'No description available';
    
    return `
        <div class="news-card">
            <img src="${imageUrl}" alt="${article.title}" class="news-image" 
                 onerror="this.src='https://via.placeholder.com/400x200/667eea/white?text=News+Image'">
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${description}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source.name}</span>
                    <span class="news-date">${formatDate(article.publishedAt)}</span>
                </div>
                <a href="${article.url}" target="_blank" class="read-more">Read Full Article</a>
            </div>
        </div>
    `;
}

async function loadNews(category = 'general') {
    const container = document.getElementById('news-container');
    
    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <div class="loading-text">Loading ${category} news from India...</div>
        </div>
    `;

    try {
        // Build API URL
        let apiUrl = `${NEWS_API_BASE_URL}?apiKey=${NEWS_API_KEY}&country=${COUNTRY_CODE}&pageSize=20`;
        
        // Add category if not general
        if (category !== 'general') {
            apiUrl += `&category=${category}`;
        }
        
        console.log('Fetching news from:', apiUrl.replace(NEWS_API_KEY, 'YOUR_API_KEY')); // Log without exposing API key
        
        // Fetch real news data
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`API error: ${data.message || 'Unknown error'}`);
        }
        
        const articles = data.articles;
        
        if (!articles || articles.length === 0) {
            container.innerHTML = `
                <div class="error">
                    <h3>No articles found</h3>
                    <p>No news articles available for the ${category} category in India at the moment.</p>
                    <p>Try selecting a different category.</p>
                </div>
            `;
            return;
        }

        // Filter out articles with missing essential data
        const validArticles = articles.filter(article => 
            article.title && 
            article.title !== '[Removed]' && 
            article.description && 
            article.description !== '[Removed]'
        );

        if (validArticles.length === 0) {
            container.innerHTML = `
                <div class="error">
                    <h3>No complete articles found</h3>
                    <p>Articles are available but lack complete information. Try a different category.</p>
                </div>
            `;
            return;
        }

        // Display news articles
        container.innerHTML = `
            <div class="news-grid">
                ${validArticles.map(article => createNewsCard(article)).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = `
            <div class="error">
                <h3>⚠️ Unable to Load News</h3>
                <p>There was an error fetching the latest news: ${error.message}</p>
                <p>Please check your internet connection and try again.</p>
                <p><strong>API Status:</strong> Using NewsAPI.org with India news sources</p>
            </div>
        `;
    }
}

// Event listeners for category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Load news for selected category
        const category = e.target.getAttribute('data-category');
        currentCategory = category;
        loadNews(category);
    });
});

// Load initial news
loadNews(currentCategory);

// Auto-refresh news every 5 minutes
setInterval(() => {
    loadNews(currentCategory);
}, 300000);