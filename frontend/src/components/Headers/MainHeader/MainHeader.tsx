import React, { useState, useEffect, useRef } from 'react'
import styles from "./MainHeader.module.css"
import { BsSearch } from 'react-icons/bs';
import { 
    PiHeartLight, 
    PiUserLight, 
    PiShoppingCartLight, 
    PiMapPinLight,
    PiMapPinFill,
} from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import FullLogo from '../../Logos/FullLogo/FullLogo';
import { axios } from '../../../services/api';
import { CategoryName } from '../../../types/CategoryType';


type Props = {
    shadow?: boolean
}

const MainHeader: React.FC<Props> = ({ shadow }): JSX.Element => {
    const [searchText, setSearchText] = useState<string>("")
    const [suggestions, setSuggestions] = useState<CategoryName[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [locationIsFocused, setLocationIsFocused] = useState<boolean>(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

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

    useEffect(() => {
        const get_categories_name = async () => {
            try {
                const response = await axios.get(`/products/name/?search=${searchText}`)
                if(searchText && response.status === 200){
                    setSuggestions(response.data.results)
                }
            } catch (error) {
                setSuggestions([])
            }
        }

        const timeout = setTimeout(() => {
            get_categories_name()
        }, 300)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchText])

    return (
        <div className={`${styles.wrapper} ${shadow ? styles.shadow : null}`}>
            <div className={styles.container}>
                <FullLogo />
                <div className={styles.containerLocation} onMouseEnter={() => setLocationIsFocused(true)} onMouseLeave={() => setLocationIsFocused(false)}>
                    <div className={styles.flexLocationIcon} >
                        {locationIsFocused ? (
                            <PiMapPinFill className={styles.locationIcon} />
                        ):(
                            <PiMapPinLight className={styles.locationIcon} />
                        )}
                    </div>
                    <div className={styles.flexLocationText}>
                        <span>14031-470</span>
                        <span>Ribeirão Preto, SP</span>
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
                        <a href="/profile" className={styles.utilIconContainer} >
                            <PiUserLight className={styles.utilIcon} />
                        </a>
                    </div>
                    <div className={styles.flexUtil}>
                        <a href="/favorites" className={styles.utilIconContainer} >
                            <PiHeartLight className={styles.utilIcon} />
                        </a>
                    </div>
                    <div className={styles.flexUtil}>
                        <a href="/favorites" className={styles.utilIconContainer} >
                            <PiShoppingCartLight className={styles.utilIcon} />
                            <div className={styles.tagNumberContainer}>3</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader