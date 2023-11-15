import React from 'react'
import styles from './SimpleHeader.module.css'
import FullLogo from '../../Logos/FullLogo/FullLogo'

type Props = {}

const SimpleHeader = (props: Props) => {
    return (
        <header className={styles.wrapper}>
            <div className={styles.container}>
                <FullLogo />
            </div>
        </header>
    )
}

export default SimpleHeader