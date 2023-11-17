import React from 'react'
import styles from "./SimpleFooter.module.css"

type Props = {}

const SimpleFooter = (props: Props) => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.wrapper}>
            <div className={styles.container}>
                <span>Copyright © 2023-{currentYear} {process.env.REACT_APP_PROJECT_NAME}. Todos os direitos reservados. <a href="/">Termos de uso</a>, <a href="/">Privacidade</a>, <a href="/">Política de cookies</a>.</span>
            </div>
        </footer>
    )
}

export default SimpleFooter