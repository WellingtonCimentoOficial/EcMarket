import React, { useCallback, useEffect, useState } from 'react'
import styles from "./MainFooter.module.css"
import FullLogo from '../../Logos/FullLogo/FullLogo'
import twitter from "../../../../assets/twitter.png"
import facebook from "../../../../assets/facebook.png"
import instagram from "../../../../assets/instagram.png"
import whatsapp from "../../../../assets/whatsapp.png"
import { axios } from '../../../../services/api'
import { SocialMediaInterface } from '../../../../types/SocialMediaType'

const MainFooter = () => {
    const [socialMedias, setSocialMedias] = useState<SocialMediaInterface[] | null>(null)

    const initialData = [
        {
            id: 0,
            title: "Sobre nós",
            data: [
                {
                    id: 0,
                    title: "Quem somos?",
                    path: "/"
                },
                {
                    id: 1,
                    title: "Apresentação",
                    path: "/"
                },
                {
                    id: 2,
                    title: "Equipe",
                    path: "/"
                },
                {
                    id: 3,
                    title: "Participações",
                    path: "/"
                }
            ]
        },
        {
            id: 1,
            title: "Pagamentos",
            data: [
                {
                    id: 0,
                    title: "Bandeiras",
                    path: "/"
                },
                {
                    id: 1,
                    title: "Cartão de débito",
                    path: "/"
                },
                {
                    id: 2,
                    title: "Cartão de crédito",
                    path: "/"
                },
                {
                    id: 3,
                    title: "Pix",
                    path: "/"
                },
                {
                    id: 4,
                    title: "Segurança",
                    path: "/"
                }
            ]
        },
        {
            id: 2,
            title: "Contato",
            data: [
                {
                    id: 0,
                    title: "E-mail",
                    path: "/"
                },
                {
                    id: 1,
                    title: "Whatsapp",
                    path: socialMedias?.find(item => item.id === 0)?.url || '/'
                },
                {
                    id: 2,
                    title: "Formulário",
                    path: "/"
                }
            ]
        },
        {
            id: 3,
            title: "Termos",
            data: [
                {
                    id: 0,
                    title: "Política de Privacidade",
                    path: "/"
                },
                {
                    id: 1,
                    title: "Termos de Uso",
                    path: "/"
                }
            ]
        }
    ]

    const [data, setData] = useState<{id: Number, title: string, data: {id: number, title: string, path: string}[]}[]>(initialData)

    const getSocialMedia = useCallback(async () => {
        try {
            const response = await axios.get('/settings/socialmedia/')
            if(response.status === 200){
                const responseData: SocialMediaInterface[] = response.data
                setSocialMedias(responseData)
                setData(oldValue => {
                    const updated = oldValue.map(section => {
                        if(section.id === 2){
                            return {
                                ...section, 
                                data: section.data.map(item => {
                                if(item.id === 1){
                                    return {
                                        ...item, 
                                        path: String(responseData.find(responseItem => responseItem.company === 0)?.url || '/')
                                    }
                                }
                                return item
                            })}
                        }
                        return section
                    })
                    return updated
                })
            }
        } catch (error) {
            setSocialMedias(null)
        }
    }, [setSocialMedias])

    useEffect(() => {getSocialMedia()}, [getSocialMedia])

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
                                    <a href={socialMedias?.find(item => item.company === 1)?.url || '/'} className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={instagram} alt="instagram" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href={socialMedias?.find(item => item.company === 2)?.url || '/'} className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={facebook} alt="facebook" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href={socialMedias?.find(item => item.company === 3)?.url || '/'} className={styles.flexColumnA}>
                                        <img className={styles.socialMediaImg} src={twitter} alt="twitter" />
                                    </a>
                                </li>
                                <li className={styles.flexColumnBLi}>
                                    <a href={socialMedias?.find(item => item.company === 0)?.url || '/'} className={styles.flexColumnA}>
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