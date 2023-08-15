import React, { useEffect, useRef } from 'react'
import styles from "./HeaderAndContentLayout.module.css"
import { PiArrowRightLight, PiCaretRightLight, PiCaretLeftLight } from 'react-icons/pi';
import { useScrollHandler } from '../../hooks/useScrollHandler';

type Props = {
    title: string
    href: string
    enableScroll?: boolean
    autoScroll?: boolean
    scrollInterval?: number
    children: React.ReactNode
}

const HeaderAndContentLayout: React.FC<Props> = ({ title, href, enableScroll, autoScroll, scrollInterval, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { handleScroll, isScrollbarAtEnd, isScrollbarAtStart } = useScrollHandler({ref: scrollRef})

    useEffect(() => {
        if(enableScroll && autoScroll){
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
    }, [handleScroll, enableScroll, autoScroll, scrollInterval])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <a href={href} className={styles.description}>
                        Ver mais
                        <PiArrowRightLight className={styles.descriptionIcon} />
                    </a>
                </div>
                <div className={styles.body}>
                    <div ref={scrollRef} className={`${styles.containerBody} ${enableScroll ? styles.scroll : null}`}>
                        {React.Children.count(children) > 1 ? (
                            React.Children.map(children, (child, index) => (
                                <div className={styles.flexItem} key={index}>
                                    {child}
                                </div>
                            ))
                        ):(
                            children
                        )}
                    </div>
                    {enableScroll && (
                        <>
                            <div className={`${styles.controller} ${styles.left} ${isScrollbarAtStart ? styles.disabled : null}`} onClick={() => !isScrollbarAtStart && handleScroll("previous")}>
                                <PiCaretLeftLight className={styles.controllerIcon} />
                            </div>
                            <div className={`${styles.controller} ${styles.right} ${isScrollbarAtEnd ? styles.disabled : null}`} onClick={() => !isScrollbarAtEnd && handleScroll("next")}>
                                <PiCaretRightLight className={styles.controllerIcon} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeaderAndContentLayout