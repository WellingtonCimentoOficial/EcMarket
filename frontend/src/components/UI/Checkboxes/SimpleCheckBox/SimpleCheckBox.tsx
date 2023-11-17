import React from 'react'
import styles from "./SimpleCheckBox.module.css"

type Props = {
    name?: string
    id?: string
    value: boolean
    className?: string
    onChange?: (value: boolean) => void
}

const SimpleCheckBox = ({ name, id, value, className, onChange }: Props) => {
    return (
        <label className={`${styles.customCheckbox} ${value ? styles.checked : null}`}>
            <input 
                className={styles.checkbox} 
                type="checkbox" 
                name={name ? name : ''}
                id={id ? id : ''}
                checked={value}
                onChange={() => onChange && onChange(!value)}
            />
            <span className={`${styles.checkmark} ${className}`}>{value ? '\u2713' : ''}</span>
        </label>
    )
}

export default SimpleCheckBox