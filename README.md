![Vite](https://img.shields.io/badge/Vite-React-blueviolet?logo=vite&logoColor=white)](https://vitejs.dev/) [![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

# Movies App

A modern web application for exploring movies and TV shows, built with React, Redux Toolkit, and Vite. The app fetches data from The Movie Database (TMDb) API and provides a rich, responsive user experience with features like search, trending lists, detailed pages, and more.

## Features

-   **Browse Trending, Popular, and Top Rated Movies/TV Shows**
-   **Detailed Movie/TV Show Pages** with cast, genres, trailers, and recommendations
-   **Search Functionality** for movies and TV shows
-   **Infinite Scroll** for search results and lists
-   **Responsive Design** for all devices
-   **Lazy Loading** for images and components
-   **Video Playback** for trailers
-   **Loading Spinners and Skeletons** for smooth UX

## Project Structure

```
movies/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── ...assets
└── src/
	 ├── App.jsx
	 ├── main.jsx
	 ├── index.scss
	 ├── assets/
	 │   └── images, icons, etc.
	 ├── components/
	 │   ├── carousel/
	 │   ├── circleRating/
	 │   ├── contentWrapper/
	 │   ├── footer/
	 │   ├── genres/
	 │   ├── header/
	 │   ├── lazyLoadImage/
	 │   ├── movieCard/
	 │   ├── spinner/
	 │   ├── switchTabs/
	 │   └── videoPopup/
	 ├── hooks/
	 │   └── useFetch.jsx
	 ├── pages/
	 │   ├── 404/
	 │   ├── details/
	 │   ├── explore/
	 │   ├── home/
	 │   └── searchResult/
	 ├── store/
	 │   ├── store.js
	 │   └── slice/
	 └── utils/
		  └── api.js
```

## Main Packages & Libraries

-   [React](https://react.dev/) – UI library
-   [Redux Toolkit](https://redux-toolkit.js.org/) – State management
-   [React Router DOM](https://reactrouter.com/) – Routing
-   [Axios](https://axios-http.com/) – HTTP requests
-   [Sass](https://sass-lang.com/) – Styling
-   [Day.js](https://day.js.org/) – Date formatting
-   [React Circular Progressbar](https://www.npmjs.com/package/react-circular-progressbar) – Rating UI
-   [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component) – Infinite scroll
-   [React Player](https://www.npmjs.com/package/react-player) – Video playback
-   [React Helmet Async](https://www.npmjs.com/package/react-helmet-async) – SEO/meta tags
-   [React Icons](https://react-icons.github.io/react-icons/) – Icons
-   [React Lazy Load Image Component](https://www.npmjs.com/package/react-lazy-load-image-component) – Image lazy loading

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/davquipe/movies.git
    cd movies
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
    - Copy `.env.example` to `.env` and fill in your TMDb API token.
    ```bash
    cp .env.example .env
    # Edit .env and set VITE_APP_TMDB_TOKEN
    ```
4. **Run the development server:**
    ```bash
    npm run dev
    ```
5. **Open in your browser:**
    - Visit [http://localhost:5173](http://localhost:5173)

## Environment Variables

-   `VITE_APP_TMDB_TOKEN` – Your TMDb API token (required)
-   `VITE_APP_BASE_URL` – Base URL for the API (default: https://api.example.com)

## Folder Highlights

-   `src/components/` – Reusable UI components (carousel, header, footer, etc.)
-   `src/pages/` – Main pages (Home, Details, Explore, Search Results, 404)
-   `src/store/` – Redux store and slices
-   `src/hooks/` – Custom React hooks
-   `src/utils/` – API utilities
-   `src/assets/` – Images and static assets

## Scripts

-   `npm run dev` – Start development server
-   `npm run build` – Build for production
-   `npm run preview` – Preview production build
-   `npm run lint` – Lint code with ESLint

## License

This project is for educational and demonstration purposes.

---

Feel free to contribute or fork this project!
