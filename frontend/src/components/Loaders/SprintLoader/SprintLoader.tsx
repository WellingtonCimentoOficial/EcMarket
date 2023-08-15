import React, { useEffect } from 'react'
import styles from "./SprintLoader.module.css"

type Props = {
}

const SprintLoader = (props: Props) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [])

    return (
        <section className={styles.wrapper}>
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