import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import "./styles/image.css";
import "./styles/frame.css";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App;
