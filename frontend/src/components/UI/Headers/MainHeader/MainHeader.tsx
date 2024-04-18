import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import styles from "./MainHeader.module.css"
import { BsSearch } from 'react-icons/bs';
import { 
    PiHeartLight, 
    PiUserLight, 
    PiShoppingCartLight, 
    PiMapPinLight,
    PiMapPinFill,
    PiClipboardTextLight ,
    PiCardholderLight,
    PiSealCheckFill
} from 'react-icons/pi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FullLogo from '../../Logos/FullLogo/FullLogo';
import { axios } from '../../../../services/api';
import { CategoryName } from '../../../../types/CategoryType';
import { ZipCodeContext } from '../../../../contexts/ZipCodeContext';
import { AuthContext } from '../../../../contexts/AuthContext';
import BtnA01 from '../../Buttons/BtnA01/BtnA01';
import { UserContext } from '../../../../contexts/UserContext';
import { useAddressRequests } from '../../../../hooks/useAddressRequests';

type Props = {
    shadow?: boolean
}

type MenuConfigType = {
    body: {
        icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
        name: string,
        href: string
    }[]
    footer: {
        name: string,
        href: string
    }[]
}

const MainHeader: React.FC<Props> = ({ shadow }): JSX.Element => {
    const [searchParams] = useSearchParams()
    const { setShow, zipCodeContextData, setZipCodeContextData } = useContext(ZipCodeContext)
    const [searchText, setSearchText] = useState<string>(searchParams.get('q') || '')
    const [suggestions, setSuggestions] = useState<CategoryName[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [locationIsFocused, setLocationIsFocused] = useState<boolean>(false)

    const searchInputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const { isAuthenticated, areTokensUpdated, logout } = useContext(AuthContext)

    const { user } = useContext(UserContext)

    const { getUserAddress } = useAddressRequests()

    const menuConfig: MenuConfigType = {
        body: [
            {
                icon: <PiUserLight />,
                name: 'Minha conta',
                href: '/account/profile'
            },
            {
                icon: <PiClipboardTextLight  />,
                name: 'Meus pedidos',
                href: '/account/orders'
            },
            {
                icon: <PiHeartLight />,
                name: 'Lista de desejos',
                href: '/account/wishlist'
            },
            {
                icon: <PiShoppingCartLight />,
                name: 'Carrinho de compras',
                href: '/account/cart'
            },
            {
                icon: <PiCardholderLight  />,
                name: 'Meus cartões',
                href: '/account/cards'
            },
        ],
        footer: [
            {
                name: 'Central de ajuda',
                href: ''
            },
            {
                name: 'Fale conosco',
                href: ''
            },
            {
                name: 'Relatar problema',
                href: ''
            },
        ]
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        setShowSuggestions(false)
        if(searchText){
            searchInputRef.current?.blur()
            navigate(`/search?q=${searchText}`)
        }
    }

    const handleShow = (show: boolean) => {
        const timeout = setTimeout(() => setShowSuggestions(show), 100)

        return () => {
            clearTimeout(timeout)
        }
    }

    const get_categories_name = useCallback(async () => {
        try {
            const response = await axios.get(`/products/name/?search=${searchText}`)
            if(searchText && response.status === 200){
                setSuggestions(response.data.results)
            }
        } catch (error) {
            setSuggestions([])
        }
    }, [searchText])

    useEffect(() => {
        const timeout = setTimeout(async() => {
            await get_categories_name()
        }, 300)

        return () => {
            clearTimeout(timeout)
        }
    }, [get_categories_name])

    useEffect(() => {
        (async () => {
            if(areTokensUpdated && isAuthenticated){
                await getUserAddress({ setData: setZipCodeContextData })
            }
        })()
    }, [areTokensUpdated, isAuthenticated, getUserAddress, setZipCodeContextData])

    return (
        <div className={`${styles.wrapper} ${shadow ? styles.shadow : null}`}>
            <div className={styles.container}>
                <FullLogo />
                <div 
                    className={styles.containerLocation} 
                    onMouseEnter={() => setLocationIsFocused(true)} 
                    onMouseLeave={() => setLocationIsFocused(false)}
                    onClick={() => setShow(oldValue => !oldValue)}
                >
                    <div className={styles.flexLocationIcon} >
                        {locationIsFocused ? (
                            <PiMapPinFill className={styles.locationIcon} />
                        ):(
                            <PiMapPinLight className={styles.locationIcon} />
                        )}
                    </div>
                    <div className={styles.flexLocationText}>
                        {zipCodeContextData ? (
                            <>
                                <span className={styles.flexLocationTextTitle}>{zipCodeContextData.zip_code.slice(0, 5) + '-' + zipCodeContextData.zip_code.slice(5)}</span>
                                <span className={styles.flexLocationTextSubTitle}>{zipCodeContextData.city}, {zipCodeContextData.uf}</span>
                            </>
                        ):(
                            <>
                                <span>Selecionar endereço</span>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.containerSearch}>
                    <form className={styles.formSearch} onSubmit={handleSearch}>
                        <input 
                            ref={searchInputRef}
                            className={styles.inputSearch} 
                            type="text" 
                            name="search" 
                            id="search" 
                            placeholder='Digite o que quer procurar!' 
                            autoComplete='off'
                            value={searchText}
                            onChange={(e): void => {setSearchText(e.target.value)}}
                            onFocus={(): void => {handleShow(true)}}
                            onBlur={(): void => {handleShow(false)}} />
                        <button className={styles.buttonSearch}><BsSearch className={styles.iconSearch} /></button>
                    </form>
                    <div className={`${styles.containerSuggestions} ${showSuggestions && suggestions ? styles.showEffect : styles.hideEffect}`}>
                        <ul className={styles.ulSuggestions}>
                            {suggestions.map((item) => (
                                <li className={styles.liSuggestions} key={item.id}>
                                    <a href={`/search?q=${item.name}`} className={styles.aSuggestions}>{item.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.containerUtils}>
                    <div className={styles.flexUtil}>
                        <div className={styles.utilIconContainer} >
                            <PiUserLight className={styles.utilIcon} />
                            <div className={styles.flexUtilHeader}>
                                {(areTokensUpdated && isAuthenticated && user.first_name) ? 
                                    <>
                                        <div className={styles.flexUtilHeaderTitleContainer}>
                                            <span className={styles.flexUtilHeaderTitleContainerText}>
                                                Olá, {user.first_name.length > 10 ? `${user.first_name.slice(0, 10)}...` : user.first_name}
                                            </span>
                                            {user.is_verified && <PiSealCheckFill className={styles.flexUtilHeaderTitleContainerIcon} title='Perfil verificado' />}
                                        </div>
                                        <span className={styles.flexUtilHeaderSubTitle}>Conta e dados</span>
                                    </>
                                    :
                                    <>
                                        <div className={styles.flexUtilHeaderTitleContainer}>
                                            <span className={styles.flexUtilHeaderTitleContainerText}>Bem vindo(a)</span>
                                        </div>
                                        <span className={styles.flexUtilHeaderSubTitle}>Fazer Login</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.flexUtilBody}>
                            <div className={styles.flexUtilBodyContainer}>
                                <div className={styles.flexUtilBodyContainerHeader}>
                                    {(areTokensUpdated && isAuthenticated && user.first_name) ? (
                                        <>
                                            <PiUserLight className={styles.flexUtilBodyContainerHeaderProfileIcon} />
                                            <div className={styles.flexUtilBodyContainerHeaderRight}>
                                                <span className={styles.flexUtilBodyContainerHeaderRightTitle}>Olá, <span className={styles.flexUtilBodyContainerHeaderRightTitleName}>
                                                    {user.first_name.length > 15 ? `${user.first_name.slice(0, 15)}...` : user.first_name}
                                                </span></span>
                                                <span className={styles.flexUtilBodyContainerHeaderRightLogout} onClick={() => logout()}>Sair</span>
                                            </div>
                                        </>
                                    ):(
                                        <BtnA01 href='/account/sign-in' autoWidth>Fazer login</BtnA01>
                                    )}
                                </div>
                                <div className={styles.flexUtilBodyContainerBody}>
                                    <ul className={styles.flexUtilBodyContainerBodyUl}>
                                        {menuConfig.body.map((item, index) => (
                                            <li className={styles.flexUtilBodyContainerBodyUlLi} key={index}>
                                                <a href={item.href} className={styles.flexUtilBodyContainerBodyUlLiA}>
                                                    {React.cloneElement(item.icon, {
                                                        className: styles.flexUtilBodyContainerBodyUlLiAIcon
                                                    })}
                                                    <span className={styles.flexUtilBodyContainerBodyUlLiAText}>{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.flexUtilBodyContainerBody}>
                                    <ul className={styles.flexUtilBodyContainerBodyUl}>
                                        {menuConfig.footer.map((item, index) => (
                                            <li className={styles.flexUtilBodyContainerBodyUlLi} key={index}>
                                                <a href={item.href} className={styles.flexUtilBodyContainerBodyUlLiA}>
                                                    <span className={styles.flexUtilBodyContainerBodyUlLiAText}>{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* <div className={styles.flexUtilBodyContainerFooter}>

                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className={styles.flexUtil}>
                        <a href="/account/wishlist" className={styles.utilIconContainer} >
                            <PiHeartLight className={styles.utilIcon} />
                            <div className={styles.tagNumberContainer}>{user.wishlist_quantity}</div>
                        </a>
                    </div>
                    <div className={styles.flexUtil}>
                        <a href="/account/cart" className={styles.utilIconContainer} >
                            <PiShoppingCartLight className={styles.utilIcon} />
                            <div className={styles.tagNumberContainer}>{user.cart_quantity}</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader