import React, { useState, useEffect } from 'react'
import styles from '../SimpleProgressBar/SimpleProgressBar.module.css'

type Props = {
    currentValue: number,
    totalValue: number,
    height?: number,
    backgroundColor?: string,
}

const SimpleProgressBar = ({ currentValue, totalValue, height, backgroundColor }: Props) => {
    const [percentage, setPercentage] = useState<number>(0)

    useEffect(() => {
        setPercentage((currentValue / totalValue) * 100)
    }, [currentValue, totalValue])

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${styles.default}`} style={{height: `${height}px` || '10px'}}></div>
            <div 
                className={`${styles.container2} ${styles.default}`} 
                style={{height: `${height}px` || '10px', width: `${percentage}%`, backgroundColor: backgroundColor || 'var(--primary-color)'}}
            ></div>
        </div>
    )
}

export default SimpleProgressBar