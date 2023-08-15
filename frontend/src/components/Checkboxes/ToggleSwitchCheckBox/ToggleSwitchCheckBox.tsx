import React from 'react'
import styles from "./ToggleSwitchCheckBox.module.css"

type Props = {
    onChange: React.Dispatch<React.SetStateAction<boolean>>
    value: boolean
}

const ToggleSwitchCheckBox = ({ onChange, value }: Props) => {
    return (
        <label className={styles.toggleSwitch}>
            <input
                className={styles.toggleInput}
                type="checkbox"
                checked={value}
                onChange={() => onChange(oldValue => !oldValue)}
            />
            <span className={styles.slider}></span>
        </label>
    )
}

export default ToggleSwitchCheckBox