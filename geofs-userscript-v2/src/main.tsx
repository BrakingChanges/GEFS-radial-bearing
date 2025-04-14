import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const TARGET_SELECTOR = 'body > div.geofs-ui-center > div.geofs-auth.geofs-htmlView > div.geofs-authForm';

function injectReactApp() {
  const root = document.createElement('div');
  const target = document.querySelector(TARGET_SELECTOR)!;
  target.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

injectReactApp()
