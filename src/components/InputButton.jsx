import React from 'react';
import styles from './InputButton.module.css'

const InputButton = (props) => {

    const handler = () => {

    };

    return (
        <div className={styles.InputContainer}>
            <div className={styles.Title}>{props.title}</div>
            <div className={styles.InputButton} onClick={handler}>
                <span className={styles.Placeholder}>{props.placeholder}</span>
                <img className={styles.ButtonImage} src={props.btnimg} />
            </div>
        </div>
    )
}

export default InputButton;