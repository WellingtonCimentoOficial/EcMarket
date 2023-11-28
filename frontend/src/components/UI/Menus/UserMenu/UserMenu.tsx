import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styles from './UserMenu.module.css'
import { PiSealCheckFill, PiUserLight, PiCaretDownLight, 
    PiShoppingCartLight, PiCardholderLight, PiCaretUpLight 
} from 'react-icons/pi';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useAxiosPrivate } from '../../../../hooks/useAxiosPrivate';
import { useJwtData } from '../../../../hooks/useJwtData';

type Props = {
}

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
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [items, setItems] = useState<{
        id: number,
        show: boolean
    }[]>([])

    const data: DataType = useMemo(() => {
        return {
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
                            href: `/account/profile`
                        },
                        {
                            title: 'Seus endereços',
                            href: '/account/addresses'
                        },
                        {
                            title: 'Lista de desejos',
                            href: '/account/wishlist'
                        },
                        {
                            title: 'Trocar senha',
                            href: '/account/wishlist'
                        },
                    ]
                },
                {
                    id: 1,
                    icon: <PiShoppingCartLight />,
                    title: 'Compras',
                    data: [
                        {
                            title: 'Carrinho',
                            href: '/account/cart'
                        },
                        {
                            title: 'Pedidos',
                            href: '/account/orders'
                        },
                        {
                            title: 'Avaliações',
                            href: '/account/ratings'
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
                            href: '/account/cards'
                        },
                        {
                            title: 'Transações',
                            href: '/account/transactions'
                        },
                    ]
                },
            ]
        }
    }, [firstName, LastName, email])

    const { tokens } = useContext(AuthContext)

    const currentRoute = useLocation()

    const axiosPrivate = useAxiosPrivate()

    const { getJwtData } = useJwtData()

    const get_verified_status = useCallback(async () => {
        try {
            const response = await axiosPrivate.get('/accounts/verify/status')
            if(response?.status === 200){
                setIsVerified(response.data.is_verified)
            }
        } catch (error) {
            // ERROR IN TRY TO ACCESS .STATUS
        }
    }, [axiosPrivate, setIsVerified])

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
        const initialItems = data.body.map(father => {
            const founded = father.data.find(child => child.href === currentRoute.pathname)
            if(founded){
                return { id: father.id, show: true }
            }
            return { id: father.id, show: false }
        })
        setItems(initialItems)
    }, [data.body, currentRoute.pathname])

    
    useEffect(() => {
        if(tokens.refresh){
            const jwtData = getJwtData()
            setFirstName(jwtData ? jwtData.user_first_name : '')
            setLastName(jwtData ? jwtData.user_last_name : '')
            setEmail(jwtData ? jwtData.user_email : '')
        }
    }, [tokens.refresh, getJwtData])

    useEffect(() => { 
        if(tokens.refresh){
            get_verified_status()
        }
    }, [tokens.refresh, get_verified_status])

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerIconContainer}>
                        <PiUserLight className={styles.headerIconContainerIcon} />
                    </div>
                    <div className={styles.headerTextsContainer}>
                        <div className={styles.headerTextsContainerName}>
                            <span className={styles.headerTitle} >{data.header.name}</span>
                            { isVerified && <PiSealCheckFill className={styles.headerTextsContainerNameIcon} title='Perfil verificado' /> }
                        </div>
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
                                                        <NavLink 
                                                            to={item.href} 
                                                            className={({ isActive }) => isActive ? `${styles.bodyNavUlLiBodyNavUlLiNavLink} ${styles.bodyNavUlLiBodyNavUlLiNavLinkActive}` : `${styles.bodyNavUlLiBodyNavUlLiNavLink}`}
                                                        >
                                                            {item.title}
                                                        </NavLink>
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
    )
}

export default UserMenu