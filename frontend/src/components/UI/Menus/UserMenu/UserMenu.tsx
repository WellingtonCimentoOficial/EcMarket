import React, { useContext, useEffect, useMemo, useState } from 'react'
import styles from './UserMenu.module.css'
import { PiSealCheckFill, PiUserLight, PiCaretDownLight, 
    PiShoppingCartLight, PiCardholderLight, PiCaretUpLight 
} from 'react-icons/pi';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';

type Props = {
    shadow?: boolean
}

type DataType = {
    id: number
    icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
    title: string
    data: {
        title: string,
        href: string
    }[]
}

const UserMenu = ({ shadow }: Props) => {
    const { user } = useContext(UserContext)
    const [items, setItems] = useState<{
        id: number,
        show: boolean
    }[]>([])

    const data: DataType[] = useMemo(() => {
        return [
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
    }, [])

    const currentRoute = useLocation()

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
        const initialItems = data.map(father => {
            const founded = father.data.find(child => child.href === currentRoute.pathname)
            if(founded){
                return { id: father.id, show: true }
            }
            return { id: father.id, show: false }
        })
        setItems(initialItems)
    }, [data, currentRoute.pathname])

    return (
        <div className={`${styles.wrapper} ${shadow ? styles.shadow : null}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerIconContainer}>
                        <PiUserLight className={styles.headerIconContainerIcon} />
                    </div>
                    <div className={styles.headerTextsContainer}>
                        <div className={styles.headerTextsContainerName}>
                            <span className={styles.headerTitle} >
                                {
                                    `${user.first_name} ${user.last_name}`.length > 30 ? 
                                    `${user.first_name} ${user.last_name}`.slice(0, 30) + '...' : 
                                    `${user.first_name} ${user.last_name}`
                                }
                            </span>
                            { user.is_verified && <PiSealCheckFill className={styles.headerTextsContainerNameIcon} title='Perfil verificado' /> }
                        </div>
                        <span className={styles.headerText}>{user.email}</span>
                    </div>
                </div>
                <div className={styles.body}>
                    <nav className={styles.bodyNav}>
                        <ul className={styles.bodyNavUl}>
                            {data.map(item => (
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