import React from 'react'
import styles from "./BtnB01.module.css"

type Props = {
    autoWidth?: boolean
    children: React.ReactNode
}

const BtnB01 = ({ autoWidth, children }: Props) => {
    return (
        <div className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null}`}>
            <button className={`${styles.BtnB01} ${autoWidth ? styles.AutoWidth : null}`}>{children}</button>
        </div>
    )
}

export default BtnB01