import React from 'react'
import styles from "./MainFooter.module.css"
import FullLogo from '../../Logos/FullLogo/FullLogo'
import twitter from "../../../assets/twitter.png"
import facebook from "../../../assets/facebook.png"
import instagram from "../../../assets/instagram.png"
import whatsapp from "../../../assets/whatsapp.png"

const MainFooter = () => {

    const data = [
        {
            title: "Sobre nós",
            data: [
                {
                    title: "Quem somos?",
                    path: "/"
                },
                {
                    title: "Apresentação",
                    path: "/"
                },
                {
                    title: "Equipe",
                    path: "/"
                },
                {
                    title: "Participações",
                    path: "/"
                }
            ]
        },
        {
            title: "Pagamentos",
            data: [
                {
                    title: "Bandeiras",
                    path: "/"
                },
                {
                    title: "Cartão de débito",
                    path: "/"
                },
                {
                    title: "Cartão de crédito",
                    path: "/"
                },
                {
                    title: "Pix",
                    path: "/"
                },
                {
                    title: "Segurança",
                    path: "/"
                }
            ]
        },
        {
            title: "Contato",
            data: [
                {
                    title: "E-mail",
                    path: "/"
                },
                {
                    title: "Whatsapp",
                    path: "/"
                },
                {
                    title: "Formulário",
                    path: "/"
                }
            ]
        },
        {
            title: "Termos",
            data: [
                {
                    title: "Política de Privacidade",
                    path: "/"
                },
                {
                    title: "Termos de Uso",
                    path: "/"
                }
            ]
        }
    ]

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.containerOver}>
                    <div className={styles.containerOverHeader}>
                        <FullLogo />
                    </div>
                    <div className={styles.containerOverBody}>
                        {data.map((father, index) => (
                            <div className={styles.flexColumn} key={index}>
                                <span className={styles.title}>{father.title}</span>
                                <ul className={styles.flexColumnUl}>
                                    {father.data.map((child, index) => (
                                        <li className={styles.flexColumnLi} key={index}>
                                            <a href={child.path} className={styles.flexColumnA}>{child.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className={styles.flexColumn}>
                            <span className={styles.title}>Redes Sociais</span>
                            <ul className={styles.flexColumnBUl}>
                                <li className={styles.flexColumnBLi}>
                                    <a href="https://instagram.com" className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={instagram} alt="instagram" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href="https://facebook.com" className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={facebook} alt="facebook" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href="https://twitter.com" className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={twitter} alt="twitter" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href="https://web.whatsapp.com" className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={whatsapp} alt="whatsapp" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.containerDown}>
                    <div className={styles.containerDownItem}>
                        <span>&copy; All rights reserved {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainFooter