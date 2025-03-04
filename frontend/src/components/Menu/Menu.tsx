import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

const Menu = () => {
    
  return (
    <div className={styles["menu-container"]}>
      <ul className={styles["menu-list"]}>
        <li><Link to="/" className={styles["menu-item"]}>Головна</Link></li>
        <li><Link to="/recipes" className={styles["menu-item"]}>Рецепти</Link></li>
      </ul>
    </div>
  );
};

export default Menu;