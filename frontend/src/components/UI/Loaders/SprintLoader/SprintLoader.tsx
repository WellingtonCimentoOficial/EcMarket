import React from 'react'
import styles from "./SprintLoader.module.css"

type Props = {
    className?: string 
}

const SprintLoader = ({className}: Props) => {
    return (
        <section className={className}>
            <div className={styles.container}>
                <div className={styles.loader}>
                    <div className={styles.loaderChild}></div>
                    <div className={styles.loaderChild}></div>
                    <div className={styles.loaderChild}></div>
                    <div className={styles.loaderChild}></div>
                </div>
            </div>
        </section>
    )
}

export default SprintLoader