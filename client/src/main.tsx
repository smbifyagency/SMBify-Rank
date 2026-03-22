import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress ResizeObserver errors completely
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

// Also suppress unhandled promise rejections related to ResizeObserver
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
    e.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
