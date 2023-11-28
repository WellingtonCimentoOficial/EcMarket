import React from 'react'
import styles from "./BtnB01.module.css"
import SprintLoader from '../../Loaders/SprintLoader/SprintLoader'

type Props = {
    autoWidth?: boolean
    autoHeight?: boolean
    children: React.ReactNode
    disabled?: boolean
    className?: string
    isLoading?: boolean
}

const BtnB01 = ({ autoWidth, autoHeight, children, disabled, className, isLoading }: Props) => {
    return (
        <div className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null} ${autoHeight ? styles.AutoHeight : null}`}>
            <button 
                className={`${styles.BtnB01} ${autoWidth ? styles.AutoWidth : null}  ${autoHeight ? styles.AutoHeight : null} ${className}`} 
                disabled={disabled}>
                    { isLoading ? <SprintLoader /> : children }
            </button>
        </div>
    )
}

export default BtnB01