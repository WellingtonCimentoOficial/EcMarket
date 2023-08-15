import React, { useEffect, useRef, useState } from 'react'
import styles from "./NiceCarousel.module.css"
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi'
import { useScrollHandler } from '../../../hooks/useScrollHandler'

interface data {
    imageURL: string,
    path: string
}

type Props = {
    data: data[],
    autoScroll?: boolean,
    scrollInterval?: number
}

const NiceCarousel: React.FC<Props> = ({ autoScroll, scrollInterval, data }) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const [contScroll, setContScroll] = useState<number>(1)
    const { handleScroll } = useScrollHandler({cont: contScroll, setCont: setContScroll, ref: carouselRef})

    useEffect(() => {
        if(autoScroll){
            const randomMin: number = 30000
            const randomMax: number = 120000
            const randomInterval: number = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin

            const interval = setInterval(() => {
                handleScroll('next')
            }, scrollInterval ? scrollInterval : randomInterval)
    
            return () => {
                clearInterval(interval)
            }
        }
    }, [handleScroll, autoScroll, scrollInterval])


    return (
        <div className={styles.wrapper}>
            <div ref={carouselRef} className={styles.container}>
                <div className={`${styles.flexController} ${styles.left}`} onClick={() => handleScroll("previous")}>
                    <PiCaretLeftLight className={styles.controllerIcon} />
                </div>
                <div className={styles.carousel}>
                    {data.map((item, index) => (
                        <a className={`${styles.carouselA} ${contScroll !== (index + 1) ? styles.hideEffect : null}`} href={item.path} key={index}>
                            <img className={styles.carouselImg} src={item.imageURL} alt="" />
                        </a>
                    ))}
                </div>
                <div className={styles.detail}>
                    {data.map((_, index) => (
                        <div className={`${styles.detailItem} ${index + 1 === contScroll ? styles.active : null}`} key={index}></div>
                    ))}
                </div>
                <div className={`${styles.flexController} ${styles.right}`} onClick={() => handleScroll("next")}>
                    <PiCaretRightLight className={styles.controllerIcon} />
                </div>
                <div className={styles.debug}>
                    <div className={styles.debugWidth}></div>
                    <div className={styles.debugHeight}></div>
                </div>
            </div>
        </div>
    )
}

export default NiceCarousel