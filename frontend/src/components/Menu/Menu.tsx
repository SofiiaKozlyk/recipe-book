import { Link } from 'react-router-dom';
import styles from './Menu.module.css';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';

const Menu = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles["menu-container"]}>
      <ul className={styles["menu-list"]}>
        <li><Link to="/" className={styles["menu-item"]}>Recipes</Link></li>
        {/* <li><Link to="/recipes" className={styles["menu-item"]}>Рецепти</Link></li> */}
        {/* <li><Link to="/addrecipe" className={styles["menu-item"]}>Додати рецепт</Link></li> */}
        {isAuthenticated ? (
          <>
            <li><Link to="/addrecipe" className={styles["menu-item"]}>Add a recipe</Link></li>
            <li><Link to="/login" onClick={handleLogout} className={styles["menu-item"]}>
              <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                Logout
              </button>
            </Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className={styles["menu-item"]}>Login</Link></li>
            <li><Link to="/register" className={styles["menu-item"]}>Register</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Menu;