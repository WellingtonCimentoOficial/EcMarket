import React, { useContext, useEffect, useState } from 'react'
import styles from './UserMenu.module.css'
import { PiUserLight, PiCaretDownLight, PiShoppingCartLight, PiCardholderLight, PiCaretUpLight, PiCaretUp, PiCaretDown } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';
import WidthLayout from '../../../../layouts/WidthLayout/WidthLayout';
import { AuthContext } from '../../../../contexts/AuthContext';
import { TokenType } from '../../../../types/TokenType';
import { jwtDecode } from 'jwt-decode';

type Props = {}

type DataType = {
    header: {
        name: string
        email: string
    }
    body: {
        id: number
        icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
        title: string
        data: {
            title: string,
            href: string
        }[]
    }[]
}

const UserMenu = (props: Props) => {
    const [firstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [items, setItems] = useState<{
        id: number,
        show: boolean
    }[]>([])

    const data: DataType = {
        header: {
            name: `${firstName} ${LastName}`,
            email: email
        },
        body: [
            {
                id: 0,
                icon: <PiUserLight />,
                title: 'Minha conta',
                data: [
                    {
                        title: 'Dados pessoais',
                        href: '/'
                    },
                    {
                        title: 'Seus endereços',
                        href: '/'
                    },
                ]
            },
            {
                id: 1,
                icon: <PiShoppingCartLight />,
                title: 'Compras',
                data: [
                    {
                        title: 'Pedidos',
                        href: '/'
                    },
                    {
                        title: 'Avaliações',
                        href: '/'
                    },
                ]
            },
            {
                id: 2,
                icon: <PiCardholderLight />,
                title: 'Carteira',
                data: [
                    {
                        title: 'Cartões',
                        href: '/'
                    },
                    {
                        title: 'Transações',
                        href: '/'
                    },
                ]
            },
        ]
    }

    const { tokens } = useContext(AuthContext)

    const handleShowHide = (id: number) => {
        setItems(prev => {
            return prev.map(item => {
                if(item.id === id){
                    return { ...item, show: !item.show }
                }
                return item
            })
        })
    }

    useEffect(() => {
        const initialItems = data.body.map(item => ({id: item.id, show: false}))
        setItems(initialItems)
    }, [])

    
    useEffect(() => { // GET USER FIRST NAME IN TOKEN
        if(tokens.refresh){
            try {
                const jwt_data: TokenType = jwtDecode(tokens.refresh)
                setFirstName(jwt_data.user_first_name)
                setLastName(jwt_data.user_last_name)
                setEmail(jwt_data.user_email)
            } catch (error) {
                // ENTER HERE WHEN TOKENS.REFRESH HAS A INVALID VALUE
            }
        }
    }, [tokens.refresh])

    return (
        <WidthLayout width={90}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerIconContainer}>
                            <PiUserLight className={styles.headerIconContainerIcon} />
                        </div>
                        <div className={styles.headerTextsContainer}>
                            <span className={styles.headerTitle}>{data.header.name}</span>
                            <span className={styles.headerText}>{data.header.email}</span>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <nav className={styles.bodyNav}>
                            <ul className={styles.bodyNavUl}>
                                {data.body.map(item => (
                                    <li className={styles.bodyNavUlLi} key={item.id}>
                                        <div className={styles.bodyNavUlLiHeader} onClick={() => handleShowHide(item.id)}>
                                            <div className={styles.bodyNavUlLiHeaderLeft}>
                                                {React.cloneElement(item.icon, { className: styles.bodyNavUlLiHeaderIcon })}
                                                <span className={styles.bodyNavUlLiHeaderTitle}>{item.title}</span>
                                            </div>
                                            {!items.find(it => it.id === item.id)?.show ? (
                                                <PiCaretDownLight className={styles.bodyNavUlLiHeaderIconCaret} />
                                            ) : (
                                                <PiCaretUpLight className={styles.bodyNavUlLiHeaderIconCaret} />
                                            )}
                                        </div>
                                        <div className={`${styles.bodyNavUlLiBody} ${!items.find(it => it.id === item.id)?.show ? styles.bodyNavUlLiBodyHide : null}`}>
                                            <nav className={styles.bodyNavUlLiBodyNav}>
                                                <ul className={styles.bodyNavUlLiBodyNavUl}>
                                                    {item.data.map((item, index) => (
                                                        <li className={styles.bodyNavUlLiBodyNavUlLi} key={index}>
                                                            <NavLink to={item.href} className={styles.bodyNavUlLiBodyNavUlLiNavLink}>{item.title}</NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </WidthLayout>
    )
}

export default UserMenu