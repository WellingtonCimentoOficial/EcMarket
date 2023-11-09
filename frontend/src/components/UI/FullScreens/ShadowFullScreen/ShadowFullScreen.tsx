import React, { useEffect } from 'react'
import styles from "./ShadowFullScreen.module.css"

type Props = {
    children: React.ReactNode
}

const ShadowFullScreen: React.FC<Props> = ({children}) => {
    
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [])

    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    )
}

export default ShadowFullScreen