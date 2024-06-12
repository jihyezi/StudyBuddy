import React from "react";
import styles from './Inputfield.module.css'

const Inputfield = (props) => {
    return (
        <div className={styles.InputContainer}>
            <div className={styles.Title}>{props.title}</div>
            <input
                className={styles.InputField}
                type="text"
                placeholder={props.placeholder} />
        </div>
    )
}


export default Inputfield;