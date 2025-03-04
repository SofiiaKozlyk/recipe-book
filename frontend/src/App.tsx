import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import RecipePage from "./pages/RecipePage/RecipePage";
import Menu from "./components/Menu/Menu";


function App() {

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
      </Routes>
    </>
  );
}

export default App;
