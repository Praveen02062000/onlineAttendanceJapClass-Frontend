import "./Main.css";
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { Store } from "./Reducer/Store"




const root = ReactDOM.createRoot(document.getElementById('root'));
document.querySelector("title").innerText = "SandhiyaClass"
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
