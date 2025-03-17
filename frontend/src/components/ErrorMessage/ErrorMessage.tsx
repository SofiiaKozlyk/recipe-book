import styles from "./ErrorMessage.module.css";

const ErrorMessage = () => {

    return (
        <>
            <div className={styles["error-message"]}>
                <p>Something went wrong! Try again.</p>
            </div>
        </>
    );
}

export default ErrorMessage;