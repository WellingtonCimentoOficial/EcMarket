import React, { RefObject, useEffect, useRef, useState } from 'react'
import styles from "./AllCategoriesMenu.module.css"
import { PiCaretRightLight, PiArrowBendUpLeftLight } from 'react-icons/pi';


type Props = {
    show?: boolean
    setShow: (value: boolean) => void
    triggerElement: RefObject<HTMLLIElement>
}

const AllCategoriesMenu: React.FC<Props> = ({ show, setShow, triggerElement }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null)
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
        if(!show){
            setHoveredIndex(-1)
        }
    }, [show])

    useEffect(() => {
        const handleHide = (event: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(event.target as Node) && triggerElement.current && !triggerElement.current.contains(event.target as Node)) {
                setShow(false)
            }
        } 

        document.addEventListener('mousedown', handleHide)

        return () => {
            document.addEventListener('mousedown', handleHide)
        }
    }, [setShow, triggerElement])

    return (
        <div className={`${styles.wrapper} ${show ? styles.showEffect : styles.hideEffect}`} ref={containerRef}>
            <div className={styles.container}>
                {categories.map((categ, index) => (
                    <div className={styles.containerFather} key={index}>
                        <span className={styles.title} onClick={(): void => setHoveredIndex(index)}>
                            {categ}
                            <PiCaretRightLight className={styles.iconTitle} />
                        </span>
                        <div className={`${styles.containerChild} ${hoveredIndex === index ? styles.showEffect : styles.hideEffect}`}>
                            
                            <div className={styles.containerChildBody}>
                                <ul className={styles.ulChild}>
                                    <div className={styles.containerChildHeader} onClick={(): void => setHoveredIndex(-1)}>
                                        <div className={styles.containerChildHeaderIcon}>
                                            <PiArrowBendUpLeftLight className={styles.containerChildHeaderIconIcon} />
                                        </div>
                                        <span className={styles.containerChildHeaderText}>Voltar</span>
                                    </div>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                    <li className={styles.liChild}>
                                        <a href="/" className={styles.aChild}>{categ + index}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllCategoriesMenu