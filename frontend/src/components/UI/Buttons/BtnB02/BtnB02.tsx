import React from 'react'
import styles from "./BtnB02.module.css"

type Props = {
    autoWidth?: boolean
    children: React.ReactNode
    className?: string
    disabled?: boolean
    onClick?: () => void
}

const BtnB02 = ({ autoWidth, children, className, disabled, onClick }: Props) => {
    return (
        <div 
            onClick={() => onClick && onClick()}
            className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null}`}
        >
            <button className={`${styles.BtnB02} ${autoWidth ? styles.AutoWidth : null} ${className}`} disabled={disabled}>
                {children}
            </button>
        </div>
    )
}

export default BtnB02