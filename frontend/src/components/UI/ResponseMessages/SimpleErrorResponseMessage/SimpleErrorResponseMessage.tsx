import React from 'react'
import styles from './SimpleErrorResponseMessage.module.css'
import { PiSealWarning, PiCheck } from 'react-icons/pi'

type Props = {
    isError: boolean
    title: string
    text: string
}

const SimpleErrorResponseMessage = ({ isError, title, text }: Props) => {
    return (
        <div className={styles.wrapper} style={{ borderColor: isError ? 'red' : 'green' }}>
            <div className={styles.header}>
                {isError ? 
                    <PiSealWarning className={`${styles.headerIcon} ${styles.failure}`} /> : 
                    <PiCheck className={`${styles.headerIcon} ${styles.success}`} />
                }
            </div>
            <div className={styles.body}>
                <h3 className={`${styles.bodyTitle} ${isError ? styles.failure : styles.success}`}>{title}</h3>
                <span className={styles.bodyText}>{text}</span>
            </div>
        </div>
    )
}

export default SimpleErrorResponseMessage