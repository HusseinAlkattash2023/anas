import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./scss/main.min.css";
import { BrowserRouter } from 'react-router-dom';
import store from "./store/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);