// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App';
// import './index.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Router>
//     <App />
//   </Router>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 1. Import the AuthProvider component
import { AuthProvider } from './context/AuthContext'; // Check this path!

ReactDOM.createRoot(document.getElementById('root')).render(
  // Optional: Add <React.StrictMode> for better development checks
  <React.StrictMode>
    <Router>
      {/* 2. Wrap the entire App with the AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);