import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add additional styles for the trivia game
const styles = document.createElement('style');
styles.textContent = `
  .option-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .correct-answer {
    background-color: #6BFF6B !important;
    color: #292F36 !important;
  }
  .incorrect-answer {
    background-color: #FF6B6B !important;
    color: white !important;
  }
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    opacity: 0;
  }
  
  body {
    font-family: 'Open Sans', sans-serif;
  }

  h1, h2, h3, h4, h5, h6, .font-heading {
    font-family: 'Nunito', sans-serif;
  }
`;
document.head.appendChild(styles);

createRoot(document.getElementById("root")!).render(<App />);
