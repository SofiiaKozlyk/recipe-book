import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home/Home';
import RecipePage from "./pages/RecipePage/RecipePage";
import Menu from "./components/Menu/Menu";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <>
      <Menu isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route
            path="/login"
            element={
              <ProtectedRoute isAllowed={!isAuthenticated}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute isAllowed={!isAuthenticated}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addrecipe"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <AddRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <EditRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <ProtectedRoute isAllowed={isAuthenticated}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
      </Routes>
    </>
  );
}

export default App;
