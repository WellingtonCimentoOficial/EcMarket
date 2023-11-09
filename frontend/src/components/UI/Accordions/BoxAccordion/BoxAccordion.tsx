import React, { useState } from 'react'
import styles from "./BoxAccordion.module.css"
import { PiMinusLight, PiPlusLight } from 'react-icons/pi';


type Data = {
    title: string
    description: string
}

type Props = Data & {
    data: Data[]
}

const BoxAccordion = ({ title, description, data }: Props) => {
    const [currentBox, setCurrentBox] = useState< number | null>(null)
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <h2 className={styles.containerHeaderTitle}>{title}</h2>
                    <p className={styles.containerHeaderDescription}>{description}</p>
                </div>
                <div className={styles.containerBody}>
                    {data.map((item, index) => (
                        <div className={styles.flexItem} key={index}>
                            <div className={styles.flexItemheader} onClick={(): void => setCurrentBox(currentValue => index !== currentValue ? index : null)}>
                                <h3 className={styles.flexItemTitle}>{item.title}</h3>
                                <div className={styles.flexItemIcon}>
                                    {currentBox === index ? (
                                        <PiMinusLight className={styles.icon} />
                                    ):(
                                        <PiPlusLight className={styles.icon} />
                                    )}
                                </div>
                            </div>
                            <div className={`${styles.flexItemBody} ${currentBox === index ? styles.show : null}`}>
                                <p className={styles.flexItemDescription}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BoxAccordion