import React, { useEffect, useRef, useState, useContext } from 'react'
import styles from "./SimpleCategoriesMenu.module.css"
import { PiCaretRightLight, PiCaretLeftLight, PiListLight } from 'react-icons/pi';
import AllCategoriesMenu from '../AllCategoriesMenu/AllCategoriesMenu';
import { useScrollHandler } from '../../../hooks/useScrollHandler';
import { LoadingContext } from '../../../contexts/LoadingContext';
import { CategoryName } from '../../../types/CategoryType';
import { axios } from '../../../services/api';

type Props = {
    shadow?: boolean
}

const SimpleCategoriesMenu = (props: Props) => {
    const [showMenuAllCategories, setShowMenuAllCategories] = useState<boolean>(false)
    const btnShowMenuAllCategoriesRef = useRef<HTMLLIElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { handleScroll } = useScrollHandler({ref: scrollRef})
    const { setIsLoading } = useContext(LoadingContext)
    const [categories, setCategories] = useState<CategoryName[] | null>(null)
    
    useEffect(() => {
        const interval = setInterval(() => {
            handleScroll("next")
        }, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [handleScroll])

    useEffect(() => {
        const get_categories = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/categories/name/?limit=20&random=true')
                if(response.status === 200){
                    setCategories(response.data.results)
                }
            } catch (error) {
                setCategories(null)
            }
            setIsLoading(false)
        }
        get_categories()
    }, [setIsLoading])

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
                                {categories && categories.map(category => (
                                    <li className={styles.liFather} key={category.id}>
                                        <a href={`/search?q=&categories=${category.id}`} className={styles.title}>{category.name}</a>
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