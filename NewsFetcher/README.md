# News API Website

A responsive news website that fetches and displays real-time news from various categories.

## Features

- 📱 Fully responsive design
- 🎨 Modern glassmorphism UI
- 📰 Multiple news categories (General, Technology, Business, Health, Sports, Entertainment)
- ⚡ Real-time data fetching
- 🔄 Auto-refresh functionality
- ⏳ Loading states and error handling

## Project Structure

```
news-api-project/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles
├── js/
│   └── script.js       # JavaScript functionality
└── README.md           # Project documentation
```

## How to Run

1. Open the project folder in VS Code
2. Install the "Live Server" extension
3. Right-click on `index.html`
4. Select "Open with Live Server"

## Using Real News Data

To use real news data instead of sample data:

1. Sign up for a free API key at [NewsAPI.org](https://newsapi.org)
2. In `js/script.js`, replace the sample data section with:

```javascript
const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=YOUR_API_KEY&country=us`);
const data = await response.json();
const articles = data.articles;
```

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge