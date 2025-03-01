import styles from "./ErrorMessage.module.css";

const ErrorMessage = () => {

    return (
        <>
            <div className={styles["error-message"]}>
                <p>Щось пішло не так! Спробуйте ще раз.</p>
            </div>
        </>
    );
}

export default ErrorMessage;