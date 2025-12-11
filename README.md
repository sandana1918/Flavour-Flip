# 🍳 FlavourFlip

A modern, interactive recipe discovery and cooking companion application built with React, featuring a unique flip-book style recipe viewer and comprehensive cooking features.

Project Report : 
https://drive.google.com/file/d/1twPcVZjtJHr-nPKZn4sVK4eBezHqtpB7/view?usp=sharing

Project Demo Link:
https://drive.google.com/file/d/1cNSbnDJrn_HtN2jmopbmN4mq5ah5blmV/view

Project Code Explanation Video Link:
https://drive.google.com/file/d/1g941Nc3S0b9Z1o5F75npprhIrjtf5h8a/view?usp=sharing


## ✨ Features

### 🔍 Recipe Discovery
- **Smart Search**: Search recipes with advanced filters (cuisine, diet, prep time)
- **Trending Recipes**: Discover popular recipes from Spoonacular API
- **Local Recipes**: Create and manage your own custom recipes
- **Masonry Grid Layout**: Beautiful, responsive recipe card display

### 📖 Interactive Flip-Book Viewer
- **Unique Reading Experience**: View recipes in an elegant, page-flipping book format
- **Comprehensive Details**: Overview, ingredients, instructions, and nutrition info
- **Touch & Swipe Support**: Mobile-friendly navigation

### 👨‍🍳 Cooking Mode
- **Step-by-Step Guide**: Interactive cooking instructions with progress tracking
- **Celebration**:  Confetti animation upon recipe completion
- **Fullscreen Experience**: Distraction-free cooking interface

### 📚 Personal Cookbook
- **Favorites Collection**: Save recipes from Spoonacular or create your own
- **Shelf View**: Visualize your cookbook with 3D book spine effects
- **Recipe Management**: Edit and delete your custom recipes

### 🛒 Shopping List
- **Quick Add Items**: Build your grocery list effortlessly
- **Item Management**: Check off items as you shop
- **Persistent Storage**: Your list is saved locally

### 🎨 Theme & Design
- **Dark/Light Mode**: Toggle between elegant earth-toned themes
- **Glass Morphism UI**: Modern, sleek interface design
- **Smooth Animations**: Framer Motion powered transitions
- **3D Elements**: React Three Fiber hero scene

### 👤 User Profiles
- **Authentication**: Secure login and signup system
- **Personal Stats**: Track recipes cooked, time spent, and saved recipes
- **Avatar Generation**: Automatic profile pictures via DiceBear API

## 🚀 Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router DOM** - Navigation
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### UI Libraries
- **Framer Motion** - Animations
- **Lucide React** - Icon system
- **React PageFlip** - Flip-book functionality
- **React Parallax Tilt** - Interactive 3D tilt effects
- **React Masonry CSS** - Grid layouts
- **React Confetti** - Celebration effects

### 3D Graphics
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F

### API & Data
- **Axios** - HTTP client
- **Spoonacular API** - Recipe data source
- **JSON Server** - Local mock API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/pankajydv07/Flavour-Flip.git
cd Flavour-Flip
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
The Spoonacular API key is currently hardcoded in `src/services/api.js`. For production, create a `.env` file: 
```env
VITE_SPOONACULAR_API_KEY=your_api_key_here
```

4. **Run the application**

Start both the Vite dev server and JSON server:
```bash
npm run dev: full
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - JSON Server (Mock API)
npm run server
```

5. **Open in browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
Flavour-Flip/
├── src/
│   ├── components/
│   │   ├── 3d/              # Three.js 3D components
│   │   ├── layout/          # Navbar, Footer, Layout
│   │   └── ui/              # Reusable UI components (FlipBookViewer, etc.)
│   ├── context/
│   │   ├── AuthContext.jsx  # User authentication state
│   │   └── ThemeContext.jsx # Dark/Light theme management
│   ├── pages/
│   │   ├── LandingPage.jsx  # Home page with trending recipes
│   │   ├── DiscoverPage.jsx # Recipe search & discovery
│   │   ├── RecipeDetailPage.jsx # Individual recipe view
│   │   ├── CookbookPage.jsx # User's saved recipes
│   │   ├── CookingModePage.jsx # Step-by-step cooking guide
│   │   ├── ProfilePage.jsx  # User profile & stats
│   │   ├── AuthPage.jsx     # Login/Signup
│   │   └── ShoppingListPage.jsx # Grocery list
│   ├── services/
│   │   └── api.js           # API calls (Spoonacular & local)
│   ├── App.jsx              # Main app component & routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & Tailwind
├── db.json                  # JSON Server database
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎯 Usage

### Creating an Account
1. Click "Sign Up" in the navigation
2. Enter your name, email, and password
3. Your profile will be created with an auto-generated avatar

### Discovering Recipes
1. Navigate to "Discover" page
2. Use the search bar to find recipes by name
3. Apply filters for cuisine, diet type, or prep time
4. Click on any recipe card to view details

### Viewing Recipe Details
- **Flip-Book Mode**: Click the book icon to read the recipe as an interactive book
- **Cooking Mode**: Start step-by-step cooking with the chef hat icon
- **Save to Cookbook**: Click the heart icon to add to favorites

### Creating Your Own Recipe
1. Go to "My Cookbook"
2. Click "Create New Recipe"
3. Fill in title, image URL, ingredients, and instructions
4. Your recipe will be saved locally

### Shopping List
1. Navigate to "Shopping List"
2. Add items using the input field
3. Check off items as you shop
4. Items persist in local storage

## 🔧 Configuration

### Tailwind Theme
The app uses a custom earth-toned color palette defined in `tailwind.config.js`:
- Earth tones: 50-950 shades
- Custom fonts: Inter (body), Playfair Display (headings)

### API Configuration
Update API settings in `src/services/api.js`:
```javascript
const SPOONACULAR_API_KEY = 'your_api_key';
const LOCAL_BASE_URL = 'http://localhost:3001';
```

## 🛠️ Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run server` - Start JSON Server on port 3001
- `npm run dev:full` - Run both servers concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

### Spoonacular API
The app integrates with [Spoonacular API](https://spoonacular.com/food-api) for:
- Random/trending recipes
- Recipe search with filters
- Detailed recipe information
- Nutritional data

### Local JSON Server
Manages user data locally: 
- User accounts and authentication
- Custom recipes
- Favorites collection
- Shopping lists

## 🎨 Key Features Breakdown

### Authentication System
- Local storage-based session management
- Password-protected accounts
- User-specific data isolation

### Theme System
- Persistent theme selection (localStorage)
- Smooth transitions between light/dark modes
- Tailwind dark mode integration

### Recipe Management
- Dual source:  Spoonacular API + local recipes
- CRUD operations for custom recipes
- Favorite recipes tracking per user

## 📝 Future Enhancements

- [ ] Add recipe rating and reviews
- [ ] Implement meal planning calendar
- [ ] Add nutritional tracking
- [ ] Export shopping list functionality
- [ ] Social sharing features
- [ ] Recipe categories and tags
- [ ] Advanced search filters
- [ ] Recipe comments and notes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**pankajydv07**
- GitHub: [@pankajydv07](https://github.com/pankajydv07)

## 🙏 Acknowledgments

- [Spoonacular API](https://spoonacular.com/food-api) for recipe data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Three.js](https://threejs.org/) for 3D graphics

---

Made with ❤️ and React
