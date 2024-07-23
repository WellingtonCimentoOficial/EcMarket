import React, { useEffect, useRef, useState } from 'react'
import styles from "./NiceCarousel.module.css"
import { PiCaretLeftLight, PiCaretRightLight } from 'react-icons/pi'
import { useScrollHandler } from '../../../../hooks/useScrollHandler'
import { BannerType } from '../../../../types/BannerType'

type Props = {
    data: BannerType[],
    autoScroll?: boolean,
    scrollInterval?: number
    random?: boolean
}

const NiceCarousel: React.FC<Props> = ({ autoScroll, scrollInterval, data, random }) => {
    const [suffledData, setShuffledData] = useState<BannerType[]>([])
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

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    useEffect(() => {
        if(random){
            setShuffledData(shuffleArray(data))
        }else{
            setShuffledData(data)
        }
    }, [random, data])


    return (
        <div className={styles.wrapper}>
            <div ref={carouselRef} className={styles.container}>
                <div className={`${styles.flexController} ${styles.left}`} onClick={() => handleScroll("previous")}>
                    <PiCaretLeftLight className={styles.controllerIcon} />
                </div>
                <div className={styles.carousel}>
                    {suffledData.map((item, index) => (
                        <a className={`${styles.carouselA} ${contScroll !== (index + 1) ? styles.hideEffect : null}`} href={item.url} key={item.id}>
                            <img className={styles.carouselImg} src={item.image} alt={item.title}/>
                        </a>
                    ))}
                </div>
                <div className={styles.detail}>
                    {suffledData.map((item, index) => (
                        <div className={`${styles.detailItem} ${index + 1 === contScroll ? styles.active : null}`} key={item.id}></div>
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