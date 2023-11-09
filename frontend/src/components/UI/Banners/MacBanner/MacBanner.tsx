import React from 'react'
import styles from "./MacBanner.module.css"
import BtnA01 from '../../Buttons/BtnA01/BtnA01'

type Data = {
    title: string
    description: string
    image: string
    buttonText: string
    path: string
}

type Props = {
    data: Data
    inverse?: boolean
}

const MacBanner = ({data, inverse}: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${inverse ? styles.inverse : null}`}>
                <div className={styles.flexImage}>
                    <img className={styles.image} src={data.image} alt="banner" />
                </div>
                <div className={styles.content}>
                    <div className={styles.contentHeader}>
                        <span className={styles.preTitle}>Promoção EcMarket</span>
                        <h3 className={styles.title}>{data.title}</h3>
                    </div>
                    <div className={styles.contentBody}>
                        <p className={styles.description}>{data.description}</p>
                    </div>
                    <div className={styles.contentFooter}>
                        <BtnA01 href={data.path}>Compre já</BtnA01>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MacBanner