import React from 'react'
import styles from "./LuminexBanner.module.css"
import { PiCaretRightLight } from 'react-icons/pi';


type Props = {
    image: string
    title: string
    description: string
    btnText: string
    href: string
}

const LuminexBanner = ({ image, title, description, btnText, href }: Props) => {
    return (
        <a className={styles.wrapper} href={href}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <img className={styles.image} src={image} alt={title} />
                </div>
                <div className={styles.body}>
                    <h3 className={styles.title}>{title.slice(0, 60) + `${title.length > 60 ? '...' : ''}`}</h3>
                    <p className={styles.description}>{description.slice(0, 125) + `${description.length > 125 ? '...' : ''}`}</p>
                    <span className={styles.btnBuy}>
                        {btnText}
                        <PiCaretRightLight />
                    </span>
                </div>
            </div>
        </a>
    )
}

export default LuminexBanner