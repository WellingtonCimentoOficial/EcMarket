import React from 'react'
import styles from "./SimpleFooter.module.css"

type Props = {}

const SimpleFooter = (props: Props) => {
    return (
        <footer className={styles.wrapper}>
            <div className={styles.container}>
                <span>Copyright © 1995-2023 eBay Inc. Todos os direitos reservados. Contrato do Usuário, Privacidade, Termos de Uso de Pagamentos, Cookies e AdChoice</span>
            </div>
        </footer>
    )
}

export default SimpleFooter