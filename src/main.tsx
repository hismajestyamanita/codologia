import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAnalytics } from './shared/analytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => initAnalytics());
}
