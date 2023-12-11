import React from 'react'
import styles from "./BtnB02.module.css"

type Props = {
    autoWidth?: boolean
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

const BtnB02 = ({ autoWidth, children, className, onClick }: Props) => {
    return (
        <div 
            onClick={() => onClick && onClick()}
            className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null}`}
        >
            <button className={`${styles.BtnB02} ${autoWidth ? styles.AutoWidth : null} ${className}`}>{children}</button>
        </div>
    )
}

export default BtnB02