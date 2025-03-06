import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import RecipePage from "./pages/RecipePage/RecipePage";
import Menu from "./components/Menu/Menu";
import AddRecipe from "./pages/AddRecipe/AddRecipe";


function App() {

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
      </Routes>
    </>
  );
}

export default App;
