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
    PiCardholderLight 
} from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import FullLogo from '../../Logos/FullLogo/FullLogo';
import { axios } from '../../../../services/api';
import { CategoryName } from '../../../../types/CategoryType';
import { ZipCodeContext } from '../../../../contexts/ZipCodeContext';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useAxiosPrivate } from '../../../../hooks/useAxiosPrivate';

type Props = {
    shadow?: boolean
}

type MenuConfigType = {
    header: {
        name: string
    }
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
    const { setShow, zipCode } = useContext(ZipCodeContext)
    const [searchText, setSearchText] = useState<string>("")
    const [suggestions, setSuggestions] = useState<CategoryName[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [locationIsFocused, setLocationIsFocused] = useState<boolean>(false)
    const [cartNumberOfItems, setCartNumberOfItems] = useState<number>(0)
    const [user, setUser] = useState('Wellington')
    const searchInputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const { tokens } = useContext(AuthContext)

    const axiosPrivate = useAxiosPrivate()

    const menuConfig: MenuConfigType = {
        header: {
            name: 'Wellington'
        },
        body: [
            {
                icon: <PiUserLight />,
                name: 'Minha conta',
                href: '/'
            },
            {
                icon: <PiClipboardTextLight  />,
                name: 'Meus pedidos',
                href: '/'
            },
            {
                icon: <PiHeartLight />,
                name: 'Lista de desejos',
                href: '/'
            },
            {
                icon: <PiShoppingCartLight />,
                name: 'Carrinho de compras',
                href: '/'
            },
            {
                icon: <PiCardholderLight  />,
                name: 'Meus cartões',
                href: '/'
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

    const get_cart = useCallback(async () => {
        const response = await axiosPrivate.get('/cart/')
        if(response.status === 200){
            setCartNumberOfItems(response.data.products.length)
        }
    }, [axiosPrivate])

    useEffect(() => {
        const timeout = setTimeout(() => {
            get_categories_name()
        }, 300)

        return () => {
            clearTimeout(timeout)
        }
    }, [get_categories_name])

    useEffect(() => {
        if(tokens.refresh){
            get_cart()
        }
    }, [tokens.refresh, get_cart])

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
                        {zipCode ? (
                            <>
                                <span className={styles.flexLocationTextTitle}>{zipCode.zip_code.slice(0, 5) + '-' + zipCode.zip_code.slice(5)}</span>
                                <span className={styles.flexLocationTextSubTitle}>{zipCode.city}, {zipCode.uf}</span>
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
                        <a href="/accounts/profile" className={styles.utilIconContainer} >
                            <PiUserLight className={styles.utilIcon} />
                            <div className={styles.flexUtilHeader}>
                                {user ? 
                                    <>
                                        <span className={styles.flexUtilHeaderTitle}>Olá, {user.length > 10 ? `${user.slice(0, 10)}...` : user}</span>
                                        <span className={styles.flexUtilHeaderSubTitle}>Conta e dados</span>
                                    </>
                                    :
                                    <>
                                        <span className={styles.flexUtilHeaderTitle}>Olá, </span>
                                        <span className={styles.flexUtilHeaderSubTitle}>Fazer Login</span>
                                    </>
                                }
                            </div>
                        </a>
                        <div className={styles.flexUtilBody}>
                            <div className={styles.flexUtilBodyContainer}>
                                <div className={styles.flexUtilBodyContainerHeader}>
                                    <PiUserLight className={styles.flexUtilBodyContainerHeaderProfileIcon} />
                                    <div className={styles.flexUtilBodyContainerHeaderRight}>
                                        <span className={styles.flexUtilBodyContainerHeaderRightTitle}>Olá, <span className={styles.flexUtilBodyContainerHeaderRightTitleName}>Wellington</span></span>
                                        <span className={styles.flexUtilBodyContainerHeaderRightLogout}>Sair</span>
                                    </div>
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
                        <a href="/accounts/favorites" className={styles.utilIconContainer} >
                            <PiHeartLight className={styles.utilIcon} />
                        </a>
                    </div>
                    <div className={styles.flexUtil}>
                        <a href="/accounts/favorites" className={styles.utilIconContainer} >
                            <PiShoppingCartLight className={styles.utilIcon} />
                            {cartNumberOfItems > 0 && <div className={styles.tagNumberContainer}>{cartNumberOfItems}</div>}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader