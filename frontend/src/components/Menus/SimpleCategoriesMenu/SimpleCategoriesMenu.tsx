import React, { useEffect, useRef, useState } from 'react'
import styles from "./SimpleCategoriesMenu.module.css"
import { PiCaretRightLight, PiCaretLeftLight, PiListLight } from 'react-icons/pi';
import AllCategoriesMenu from '../AllCategoriesMenu/AllCategoriesMenu';
import { useScrollHandler } from '../../../hooks/useScrollHandler';

type Props = {
    shadow?: boolean
}

const SimpleCategoriesMenu = (props: Props) => {
    const [showMenuAllCategories, setShowMenuAllCategories] = useState<boolean>(false)
    const btnShowMenuAllCategoriesRef = useRef<HTMLLIElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { handleScroll } = useScrollHandler({ref: scrollRef})

    const categories: string[] = [
        "Eletronicos",
        "Camisetas",
        "Shorts",
        "Kit calça jeans",
        "Acessórios pessoais",
        "Iphone",
        "Mac book",
        "Ipad",
        "Suprimentos",
        "Medicamentos",
        "Creatina",
        "Eeletronicos",
        "Camisetas",
        "Shorts",
        "Kit calça jeans",
        "Acessórios pessoais",
        "Iphone",
        "Mac book",
        "Ipad",
        "Suprimentos",
        "Medicamentos",
        "Creatina",
    ]
    
    useEffect(() => {
        const interval = setInterval(() => {
            handleScroll("next")
        }, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [handleScroll])

    return (
        <>
            <div className={`${styles.wrapper} ${props.shadow ? styles.shadow : null}`}>
                <div className={styles.container}>
                    <div className={styles.containerFather}>
                        <ul className={styles.ulFather}>
                            <li ref={btnShowMenuAllCategoriesRef} className={`${styles.LiBtnMenu} ${showMenuAllCategories ? styles.active : null}`} onClick={(): void => setShowMenuAllCategories(oldValue => !oldValue)}>
                                <PiListLight className={styles.BtnMenuIcon} />
                                Todos
                            </li>
                            <li className={`${styles.liController} ${styles.liControllerLeft}`} onClick={() => handleScroll("previous")}>
                                <PiCaretLeftLight className={styles.nextIcon} />
                            </li>
                            <div className={styles.containerChildren} ref={scrollRef}>
                                {categories.map((categ, index) => (
                                    <li className={styles.liFather} key={index}>
                                        <a href="/" className={styles.title}>{categ}</a>
                                    </li>
                                ))}
                            </div>
                            <li className={`${styles.liController} ${styles.liControllerRight}`} onClick={() => handleScroll("next")}>
                                <PiCaretRightLight className={styles.nextIcon} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <AllCategoriesMenu show={showMenuAllCategories} setShow={setShowMenuAllCategories} triggerElement={btnShowMenuAllCategoriesRef}  />
        </>
    )
}

export default SimpleCategoriesMenu