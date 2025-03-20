import RecipesDisplay from '../../components/RecipesDisplay/RecipesDisplay';
import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { getAllRecipes, searchRecipes } from '../../api/recipeActions';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useRequest } from 'ahooks';
import Cookies from 'js-cookie';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, error, data: recipes, run: fetchRecipes } = useRequest(
    async () => (searchTerm ? await searchRecipes(searchTerm) : await getAllRecipes()),
    {
      manual: true,
    }
  );

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');

    if (consent && consent === 'accepted') {
      const lastSearchTerm = Cookies.get('lastSearchTerm');
      if (lastSearchTerm) {
        setSearchTerm(lastSearchTerm);
      }
    }

    fetchRecipes();
  }, []);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (consent && consent === 'accepted' && searchTerm) {
      Cookies.set('lastSearchTerm', searchTerm, { expires: 365 });
    }

    fetchRecipes();
  }, [searchTerm, fetchRecipes]);

  return (
    <div className={styles["home-container"]}>
      <input
        type="text"
        placeholder="Searching for recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles["search-input"]}
      />

      {loading && <Loading />}
      {error && <ErrorMessage />}

      {!error && !loading && <RecipesDisplay recipes={recipes || []} />}
    </div>
  );
};

export default Home;