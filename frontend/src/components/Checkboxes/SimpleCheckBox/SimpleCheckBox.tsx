import React from 'react'
import styles from "./SimpleCheckBox.module.css"

type Props = {
    value: boolean
}

const SimpleCheckBox = ({value }: Props) => {
    return (
        <label className={`${styles.customCheckbox} ${value ? styles.checked : null}`}>
            <input 
                className={styles.checkbox} 
                type="checkbox" 
                checked={value}
            />
            <span className={styles.checkmark}>{value ? '\u2713' : ''}</span>
        </label>
    )
}

export default SimpleCheckBox