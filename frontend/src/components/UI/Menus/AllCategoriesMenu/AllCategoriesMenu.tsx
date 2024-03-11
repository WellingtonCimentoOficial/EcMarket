import React, { RefObject, useEffect, useRef, useState, useContext } from 'react'
import styles from "./AllCategoriesMenu.module.css"
import { PiCaretRightLight, PiArrowBendUpLeftLight } from 'react-icons/pi';
import { CategoryName } from '../../../../types/CategoryType';
import { axios } from '../../../../services/api';
import { LoadingContext } from '../../../../contexts/LoadingContext';


type Props = {
    show?: boolean
    setShow: (value: boolean) => void
    triggerElement: RefObject<HTMLLIElement>
}

const AllCategoriesMenu: React.FC<Props> = ({ show, setShow, triggerElement }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null)
    const [categories, setCategories] = useState<CategoryName[] | null>(null)
    const { setIsLoading } = useContext(LoadingContext)

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

    useEffect(() => {
        const get_categories = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/categories/name/?limit=20&include_default=false&include_subcategories=true&max_subcategories_count=20')
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
        <div className={`${styles.wrapper} ${show ? styles.showEffect : styles.hideEffect}`} ref={containerRef}>
            <div className={styles.container}>
                {categories && categories.map(category => (
                    <div className={styles.containerFather} key={category.id}>
                        {category.sub_categories && category.sub_categories.length > 0 ? (
                            <span className={styles.title} onClick={() => setHoveredIndex(category.id)}>
                                {category.name}
                                <PiCaretRightLight className={styles.iconTitle} />
                            </span>
                        ):(
                            <a className={styles.title} href={`/search?q=&categories=${category.id}`}>
                                {category.name}
                            </a>
                        )}
                        <div className={`${styles.containerChild} ${hoveredIndex === category.id ? styles.showEffect : styles.hideEffect}`}>
                            <div className={styles.containerChildBody}>
                                <ul className={styles.ulChild}>
                                    <div className={styles.containerChildHeader} onClick={(): void => setHoveredIndex(-1)}>
                                        <div className={styles.containerChildHeaderIcon}>
                                            <PiArrowBendUpLeftLight className={styles.containerChildHeaderIconIcon} />
                                        </div>
                                        <span className={styles.containerChildHeaderText}>Voltar</span>
                                    </div>
                                    {category.sub_categories?.map(subCategory => (
                                        <li className={styles.liChild} key={subCategory.id}>
                                            <a href={`/search?q=&sub_categories=${subCategory.id}`} className={styles.aChild}>{subCategory.name}</a>
                                        </li>
                                    ))}
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