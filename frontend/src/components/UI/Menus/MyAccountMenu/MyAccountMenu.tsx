import React, { useContext, useState } from 'react'
import styles from './MyAccountMenu.module.css'
import { NavLink, useLocation } from 'react-router-dom'
import { PiSealCheckFill, PiUserLight, 
    PiShoppingCartLight, PiCardholderLight, 
    PiMapPinLight, PiHeartLight, PiKeyLight, 
    PiStarLight, PiUserFill, PiMapPinFill, 
    PiHeartFill, PiKeyFill, PiShoppingCartFill, 
    PiStarFill, PiCardholderFill, PiRepeatLight, 
    PiRepeatFill, PiClipboardTextLight, PiClipboardTextFill 
} from 'react-icons/pi';
import { UserContext } from '../../../../contexts/UserContext';
import { useAccountRequests } from '../../../../hooks/useBackendRequests';

type Props = {
    shadow: boolean
}

type Data = {
    name: string
    href: string
    icon: React.ReactElement
    iconFill: React.ReactElement
}

const MyAccountMenu = ({ shadow }: Props) => {
    const currentRoute = useLocation()
    const { user } = useContext(UserContext)
    const { sendAccountVerificationCode } = useAccountRequests()
    const [isVerificationEmailSent, setIsVerificationEmailSent] = useState<boolean>(false)

    const data: Data[] = [
        {
            name: 'Dados pessoais',
            href: `/account/profile`,
            icon: <PiUserLight />,
            iconFill: <PiUserFill />
        },
        {
            name: 'Seus endereços',
            href: '/account/addresses',
            icon: <PiMapPinLight />,
            iconFill: <PiMapPinFill />
        },
        {
            name: 'Lista de desejos',
            href: '/account/wishlist',
            icon: <PiHeartLight />,
            iconFill: <PiHeartFill />
        },
        {
            name: 'Trocar senha',
            href: '/account/password/change',
            icon: <PiKeyLight />,
            iconFill: <PiKeyFill />
        },
        {
            name: 'Carrinho',
            href: '/account/cart',
            icon: <PiShoppingCartLight />,
            iconFill: <PiShoppingCartFill />
        },
        {
            name: 'Pedidos',
            href: '/account/orders',
            icon: <PiClipboardTextLight />,
            iconFill: <PiClipboardTextFill />
        },
        {
            name: 'Avaliações',
            href: '/account/ratings',
            icon: <PiStarLight />,
            iconFill: <PiStarFill />
        },
        {
            name: 'Cartões',
            href: '/account/cards',
            icon: <PiCardholderLight />,
            iconFill: <PiCardholderFill />
        },
        {
            name: 'Transações',
            href: '/account/transactions',
            icon: <PiRepeatLight />,
            iconFill: <PiRepeatFill />
        }
    ]

    const handleSendAccountVerificationCode = ({ sent } : { sent: boolean }) => {
        setIsVerificationEmailSent(sent)
    }

    return (
        <div className={`${styles.wrapper} ${shadow ? styles.shadow : null}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerIconContainer}>
                        <PiUserLight className={styles.headerIconContainerIcon} />
                    </div>
                    <div className={styles.headerTextsContainer}>
                        { !user.is_verified && (
                            !isVerificationEmailSent ? (
                                <span 
                                    className={styles.headerTextsContainerNameVerify} 
                                    onClick={() => sendAccountVerificationCode({
                                        callback: handleSendAccountVerificationCode
                                    })}>
                                        Verificar
                                </span> 
                            ):(
                                <span className={styles.headerTextsContainerNameVerified}>E-mail enviado!</span>
                            )
                        )
                        }
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
                    <ul className={styles.bodyUl}>
                        {data?.map((item, index) => (
                            <li className={styles.bodyUlLi} key={index}>
                                <NavLink 
                                    to={item.href}
                                    className={({ isActive }) => isActive ? `${styles.active} ${styles.bodyUlLiNavLink}` : styles.bodyUlLiNavLink}
                                >
                                    {React.cloneElement(
                                        currentRoute.pathname === item.href ? item.iconFill : item.icon, 
                                        {className: styles.icon})
                                    }
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MyAccountMenu