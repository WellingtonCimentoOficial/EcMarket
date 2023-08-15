import React from 'react'
import styles from "./WidthLayout.module.css"

type Props = {
    width?: number
    children: React.ReactNode
}

const WidthLayout: React.FC<Props> = ({width = 80, children}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container} style={{width: `${width}%`}}>
                {children}
            </div>
        </div>
    )
}

export default WidthLayout