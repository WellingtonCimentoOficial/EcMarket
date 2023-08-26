import styles from "./BarPagination.module.css"
import { PiArrowUUpLeftLight, PiArrowUUpRightLight } from 'react-icons/pi';


type Props = {
    totalPageCount: number
    currentPage: number
    onChange: React.Dispatch<React.SetStateAction<number>>
}

const BarPagination = ({ totalPageCount, currentPage, onChange }: Props) => {

    const handlePrevious = () => {
        if(currentPage - 1 >= 0){
            onChange(value => value - 1)
        }
    }

    const handleNext = () => {
        if(currentPage + 1 < totalPageCount){
            onChange(value => value + 1)
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.controller} onClick={handlePrevious}>
                    <PiArrowUUpLeftLight className={styles.controllerIcon} />
                    <span className={styles.controllerText}>Anterior</span>
                </div>
                {totalPageCount > 5 && currentPage + 1 > totalPageCount / 2 && (
                    <>
                        <div className={styles.flexItem} onClick={() => onChange(0)}>
                            <span className={styles.flexItemText}>1</span>
                        </div>
                        <div className={styles.flexItem}>
                            <span className={styles.flexItemText}>...</span>
                        </div>
                    </>
                )}
                {Array.from(Array(totalPageCount)).map((_, index) => {
                    if(totalPageCount > 5){
                        if (
                            (totalPageCount > 5 && currentPage === index) || // Página atual
                            (totalPageCount > 5 && currentPage + 1 === index) || // Próxima página
                            (totalPageCount > 5 && currentPage + 2 === index) // Página seguinte à próxima
                        ) {
                            return (
                                <div className={`${styles.flexItem} ${index === currentPage ? styles.selected : null}`} key={index} onClick={() => onChange(index)}>
                                    <span className={styles.flexItemText}>{index + 1}</span>
                                </div>
                            )
                        }else{
                            return null
                        }
                    }else{
                        return (
                            <div className={`${styles.flexItem} ${index === currentPage ? styles.selected : null}`} key={index} onClick={() => onChange(index)}>
                                <span className={styles.flexItemText}>{index + 1}</span>
                            </div>
                        )
                    }
                })}
                {totalPageCount > 5 && currentPage + 1 < totalPageCount / 2 && (
                    <>
                        <div className={styles.flexItem}>
                            <span className={styles.flexItemText}>...</span>
                        </div>
                        <div className={styles.flexItem} onClick={() => onChange(totalPageCount - 1)}>
                            <span className={styles.flexItemText}>{totalPageCount}</span>
                        </div>
                    </>
                )}
                <div className={styles.controller} onClick={handleNext}>
                    <span className={styles.controllerText}>Próximo</span>
                    <PiArrowUUpRightLight className={styles.controllerIcon} />
                </div>
            </div>
        </div>
    )
}

export default BarPagination