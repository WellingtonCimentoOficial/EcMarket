import React from 'react'
import styles from "./FullLogo.module.css"

const FullLogo: React.FC = (): JSX.Element => {
    return (
        <div className={styles.containerLogo}>
            <h1><a href="/" className={styles.title}>EcMarket</a></h1>
        </div>
    )
}

export default FullLogo