import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home/Home';
import RecipePage from "./pages/RecipePage/RecipePage";
import Menu from "./components/Menu/Menu";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";


function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
      </Routes>
    </>
  );
}

export default App;
