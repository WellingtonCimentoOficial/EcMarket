import React, { useEffect } from 'react'
import styles from "./SprintLoader.module.css"

type Props = {
    className?: string 
}

const SprintLoader = ({className}: Props) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [])

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