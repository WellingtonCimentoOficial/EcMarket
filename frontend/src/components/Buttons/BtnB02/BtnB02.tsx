import React from 'react'
import styles from "./BtnB02.module.css"

type Props = {
    autoWidth?: boolean
    children: React.ReactNode
}

const BtnB02 = ({ autoWidth, children }: Props) => {
    return (
        <div className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null}`}>
            <button className={`${styles.BtnB02} ${autoWidth ? styles.AutoWidth : null}`}>{children}</button>
        </div>
    )
}

export default BtnB02