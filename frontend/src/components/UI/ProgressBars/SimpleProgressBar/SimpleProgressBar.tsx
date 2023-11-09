import React, { useState, useEffect } from 'react'
import styles from '../SimpleProgressBar/SimpleProgressBar.module.css'

type Props = {
    currentValue: number,
    totalValue: number,
    height?: number,
    backgroundColor?: string,
    label?: boolean
}

const SimpleProgressBar = ({ currentValue, totalValue, height, backgroundColor, label }: Props) => {
    const [percentage, setPercentage] = useState<number>(0)

    useEffect(() => {
        setPercentage((currentValue / totalValue) * 100)
    }, [currentValue, totalValue])

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${styles.default}`} style={{height: `${height}px` || '10px'}}></div>
            <div className={`${styles.container3} ${styles.default}`} style={{height: `${height}px` || '10px', display: label ? 'flex' : 'none'}}>
                <span className={styles.label} style={{fontSize: height ? `${height - 2}px` : '10px'}}>{Math.floor(percentage)}%</span>
            </div>
            <div 
                className={`${styles.container2} ${styles.default}`} 
                style={{height: `${height}px` || '10px', width: `${percentage}%`, backgroundColor: backgroundColor || 'var(--primary-color)'}}
            ></div>
        </div>
    )
}

export default SimpleProgressBar