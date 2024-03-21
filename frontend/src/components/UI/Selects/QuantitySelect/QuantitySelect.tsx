import React, { useEffect, useState } from 'react'
import styles from "./QuantitySelect.module.css"
import { PiPlus, PiMinus } from 'react-icons/pi';


type Props = {
    min: number
    max: number
}

const QuantitySelect = ({min, max} : Props) => {
    const [value, setValue] = useState<number>(0)
    
    const handleNext = () => {
        setValue(oldValue => oldValue + 1 <= max ? oldValue + 1 : oldValue)
    }

    const handlePrevious = () => {
        setValue(oldValue => oldValue - 1 >= min ? oldValue - 1 : oldValue)
    }

    useEffect(() => setValue(min), [min])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.flexController} onClick={handlePrevious}>
                    <PiMinus className={styles.flexControllerIcon} />
                </div>
                <div className={styles.flexInput}>
                    <input className={styles.flexInputInput} type="number" name="" id="" value={value} onChange={() => setValue(oldValue => oldValue)} />
                </div>
                <div className={styles.flexController} onClick={handleNext}>
                    <PiPlus className={styles.flexControllerIcon} />
                </div>
            </div>
        </div>
    )
}

export default QuantitySelect