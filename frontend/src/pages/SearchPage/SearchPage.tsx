import React, { useState, useEffect, useContext, useCallback } from 'react'
import styles from "./SearchPage.module.css"
import { useSearchParams } from 'react-router-dom'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import { Product } from '../../types/ProductType'
import { axios } from '../../services/api'
import SimpleProductCard from '../../components/UI/ProductCards/SimpleProductCard/SimpleProductCard'
import ToggleSwitchCheckBox from '../../components/UI/Checkboxes/ToggleSwitchCheckBox/ToggleSwitchCheckBox'
import SimpleCheckBox from '../../components/UI/Checkboxes/SimpleCheckBox/SimpleCheckBox'
import StarRating from '../../components/UI/Ratings/StarRating/StarRating'
import BarPagination from '../../components/UI/Paginations/BarPagination/BarPagination'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import { Category } from '../../types/CategoryType'
import { LoadingContext } from '../../contexts/LoadingContext'
import SimpleSelect from '../../components/UI/Selects/SimpleSelect/SimpleSelect'
import { SelectType } from '../../types/SelectType'
import { useQueryParam } from '../../hooks/useQueryParam'
import BtnB01 from '../../components/UI/Buttons/BtnB01/BtnB01'
import { usePageTitleChanger } from '../../hooks/usePageTitleChanger'
import { Filter, FilterData } from '../../types/FilterType'
import NickRangeSlider from '../../components/UI/RangeSliders/NickRangeSlider/NickRangeSlider'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'

const SearchPage = () => {
    const [searchParams] = useSearchParams()
    
    const queryParam = searchParams.get('q')
    const ratingParam = searchParams.get('rating')
    const pageParam = searchParams.get('page')
    const relevanceParam = searchParams.get('relevance')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')

    const { setIsLoading } = useContext(LoadingContext)
    const { addParam, removeParam } = useQueryParam()
    const { updateTitle } = usePageTitleChanger()
    const { CurrencyFormatter } = useCurrencyFormatter()

    const [products, setProducts] = useState<Product[]>([])
    const [filters, setFilters] = useState<Filter[]>([])
    const [currentPage, setCurrentPage] = useState<number>(pageParam && /^[0-9]+$/.test(pageParam) ? parseInt(pageParam) - 1 : 0)
    const [totalPageCount, setTotalPageCount] = useState<number>(0)
    const [totalProductCount, setTotalProductCount] = useState(1)
    const [freeShipping, setFreeShipping] = useState<boolean>(false)
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const [ratingFilter, setRatingFilter] = useState<number | null>(ratingParam !== null && /^[0-9]+$/.test(ratingParam) ? parseInt(ratingParam) : null)
    const [checkBoxValues, setCheckBoxValues] = useState<{ [key: string]: {[key: string]: boolean} }>({})
    
    const minPrice = 0
    const maxPrice = 100000
    
    const [priceFilter, setPriceFilter] = useState<[number, number]>(minPriceParam !== null && /^[0-9]+$/.test(minPriceParam) && maxPriceParam !== null && /^[0-9]+$/.test(maxPriceParam) ? [parseFloat(minPriceParam), parseFloat(maxPriceParam)] : [minPrice, maxPrice])
    const [priceFilterText, setPriceFilterText] = useState<[number, number]>([minPrice, maxPrice])

    
    const itemsPerPageData = [
        {
            text: "20",
            value: 20
        },
        {
            text: "40",
            value: 40
        },
        {
            text: "60",
            value: 60
        },
    ]

    const relevanceFilterData = [
        {
            text: "Mais relevantes",
            value: 0
        },
        {
            text: "Maior preço",
            value: 1
        },
        {
            text: "Menor preço",
            value: 2
        },
    ]
    
    const [itemsPerPage, setItemsPerPage] = useState<SelectType>(itemsPerPageData.find(item => String(item.value) === searchParams.get('limit')) || itemsPerPageData[0])
    const [relevanceFilter, setRelevanceFilter] = useState<SelectType>(relevanceFilterData.find(item => item.value === parseInt(relevanceParam || '0')) || relevanceFilterData[0] )


    const checkBoxInitialValues = useCallback(() => {
        const initialValues: { [key: string]: {[key: string]: boolean} } = {}
        filters.forEach(filter => {
            if(searchParams.has(filter.param)){
                initialValues[filter.id] = {}
                const paramData = searchParams.get(filter.param)?.split(',').map(str => parseInt(str))
                filter.data.forEach(item => {
                    if(paramData?.includes(item.id)){
                        initialValues[filter.id][item.id] = true
                    }
                })
            }
        })
        return initialValues
    }, [filters, searchParams])

    const handleFilter = useCallback((filter: Filter, item: FilterData, e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setCheckBoxValues((prevState) => {
            const updatedValues = {
                ...prevState,
                [filter.id]: {
                    ...prevState[filter.id],
                    [item.id]: !prevState[filter.id]?.[item.id] || false,
                },
            }
            const ids = Object.entries(updatedValues[filter.id] ? updatedValues[filter.id] : "").filter(([_, value]) => value === true).map(([itemId]) => itemId).join(",")
            if(ids.length > 0){
                addParam(filter.param, ids)
            }else{
                removeParam(filter.param)
            }

            return updatedValues
        })
    }, [setCheckBoxValues, addParam, removeParam])

    const handlePrice = useCallback(() => {
        addParam('minPrice', String(priceFilter[0]))
        addParam('maxPrice', String(priceFilter[1]))
    }, [priceFilter, addParam])

    const handleRating = useCallback((value : null | number) => {
        if(value !== null && value > 0 && value <= 5){
            setRatingFilter(value)
            addParam('rating', String(value))
            return
        }
        setRatingFilter(value)
        removeParam('rating')
    }, [setRatingFilter, addParam, removeParam])

    const handlePage = useCallback((value: number) => {
        if(value >= 0){
            addParam('page', String(value + 1))
            return
        }
        removeParam('page')
    }, [addParam, removeParam])

    const handleRelevance = useCallback(({ value }: SelectType) => {
        addParam('relevance', String(value))
    }, [addParam])

    const handleLimit = useCallback(() => {
        addParam('limit', String(itemsPerPage.value))
    }, [itemsPerPage, addParam])

    const get_products = useCallback(async () => {
        setIsLoading(true)
        try {
            const offset = typeof itemsPerPage.value === "number" ? currentPage * itemsPerPage.value : 0
            const dynamicFilters = filters?.map(filter => filter.param && `&${filter.param}=${Object.entries(checkBoxValues[filter.id] ? checkBoxValues[filter.id] : "").filter(([_, value]) => value === true).map(([itemId]) => itemId).join(",")}`).join('')
            
            const path = `/products/` +
            `?search=${queryParam}` +
            `&limit=${itemsPerPage?.value}` +
            `&offset=${offset}` +
            `&rating=${ratingFilter}` +
            `&relevance=${relevanceFilter.value}` +
            `&minPrice=${priceFilter[0]}` +
            `&maxPrice=${priceFilter[1]}` +
            `${dynamicFilters}`

            if(dynamicFilters){
                const response = await axios.get(path)
                if(response.status === 200){
                    setProducts(response.data.results)
                    setTotalPageCount(response.data.total_page_count)
                    setTotalProductCount(response.data.total_item_count)
                    window.scrollTo({top: 0, behavior: 'smooth'})
                }
            }
        } catch (error) {
            setTotalPageCount(0)
            setTotalProductCount(1)
            setProducts([])
        }
        setIsLoading(false)
    }, [
        itemsPerPage, currentPage, queryParam, 
        ratingFilter, relevanceFilter, filters, 
        checkBoxValues, priceFilter, setIsLoading, 
        setProducts, setTotalPageCount, setTotalProductCount
    ])
    
    const get_categories = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/categories/?limit=1&min_product_count=10&max_product_count=20&random=true')
            if(response.status === 200){
                setCategoriesData(response.data.results)
            }
        } catch (error) {
            setCategoriesData([])
        }
        setIsLoading(false)
    }, [setIsLoading, setCategoriesData])

    const get_filters = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/products/filters/')
            if(response.status === 200){
                setFilters(response.data)
            }
        } catch (error) {
            setFilters([])
        }
        setIsLoading(false)
    }, [setIsLoading, setFilters])

    useEffect(() => setCheckBoxValues(checkBoxInitialValues()), [setCheckBoxValues, checkBoxInitialValues])
    useEffect(() => handlePrice(), [handlePrice]) // calls a function whenever the page is loaded
    useEffect(() => handleLimit(), [handleLimit]) // calls a function whenever the page is loaded
    //useEffect(() => setCurrentPage(0), [itemsPerPage, setCurrentPage]) // resets currentPage whenever itemsPerPage updates
    useEffect(() => handlePage(currentPage), [currentPage, handlePage]) // calls a function whenever currentPage updates
    useEffect(() => handleRating(ratingFilter), [ratingFilter, handleRating]) // calls a function whenever ratingFilter updates
    useEffect(() => handleRelevance(relevanceFilter), [relevanceFilter, handleRelevance]) // calls a function whenever relevanceFilter updates
    useEffect(() => updateTitle(queryParam ? `(${totalProductCount}) ${queryParam} | ${process.env.REACT_APP_PROJECT_NAME}` : ""), [queryParam, totalProductCount, updateTitle]) // update page title whenever queryParam and totalProductCount update
    useEffect(() => {get_products()}, [get_products]) // calls a function whenever the page is loaded
    useEffect(() => {get_categories()}, [get_categories]) // calls a function whenever the page is loaded
    useEffect(() => {get_filters()}, [get_filters]) // calls a function whenever the page is loaded

    return (
        <WidthLayout width={90}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span>{currentPage + 1}-{totalPageCount} de {totalProductCount} resultados para <span className={styles.searchText}>{queryParam}</span></span>
                        <SimpleSelect data={relevanceFilterData} value={relevanceFilter} onChange={setRelevanceFilter} />
                    </div>
                    <div className={styles.body}>
                        <div className={`${styles.containerFilters} ${styles.filtersWrapper}`}>
                            <div className={styles.flexFilterD}>
                                <span>Frete grátis</span>
                                <ToggleSwitchCheckBox onChange={setFreeShipping} value={freeShipping} />
                            </div>
                            {filters && filters.map((filter, index) => {
                                const adjustedIndex  = index + 1
                                return (
                                    <div className={styles.filtersWrapper} key={filter.id}>
                                        <div className={styles.flexFilter}>
                                            <div className={styles.flexFilterHeader}>
                                                <h3 className={styles.flexFilterTitle}>{filter.name}</h3>
                                            </div>
                                            <div className={`${styles.flexFilterBody} ${styles.flexFilterBodyScroll}`}>
                                                {filter.data.map((item) => {
                                                    return (
                                                        <div className={styles.flexFilterItem} key={item.id} onClick={(e) => handleFilter(filter, item, e)}>
                                                            <SimpleCheckBox value={checkBoxValues[filter.id]?.[item.id] || false} />
                                                            <span className={styles.flexFilterDescription}>{`${item.name} (${item.count})`}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className={styles.flexFilterFooter}>
                                                <div className={styles.flexFilterSeparator}></div>
                                            </div>
                                        </div>
                                        {adjustedIndex === 1 && (
                                            <div className={styles.flexFilter}>
                                                <div className={styles.flexFilterHeader}>
                                                    <h3 className={styles.flexFilterTitle}>Preço</h3>
                                                </div>
                                                <div className={styles.flexFilterBody}>
                                                    <div className={styles.flexFilterItem}>
                                                        <div className={styles.flexPriceFilter}>
                                                            <div className={styles.flexPriceFilterHeader}>
                                                                <div className={styles.flexPriceFilterHeaderA}>
                                                                    <div className={styles.flexPriceFilterHeaderAItem}>
                                                                        <span className={styles.flexPriceFilterHeaderAItemText}>Mínimo:</span>
                                                                        <span className={styles.flexPriceFilterHeaderAItemText}>{CurrencyFormatter(minPrice)}</span>
                                                                    </div>
                                                                    <div className={styles.flexPriceFilterHeaderAItem}>
                                                                        <span className={styles.flexPriceFilterHeaderAItemText}>Máximo:</span>
                                                                        <span className={styles.flexPriceFilterHeaderAItemText}>{CurrencyFormatter(maxPrice)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className={`${styles.flexPriceFilterHeaderA} ${styles.flexPriceFilterHeaderB}`}>
                                                                    <div className={`${styles.flexPriceFilterHeaderAItem} ${styles.flexPriceFilterHeaderBItem}`}>
                                                                        <span className={styles.flexPriceFilterHeaderAItemTextB}>{CurrencyFormatter(priceFilterText[0])}</span>
                                                                    </div>
                                                                    <div className={`${styles.flexPriceFilterHeaderAItem} ${styles.flexPriceFilterHeaderBItem}`}>
                                                                        <span className={styles.flexPriceFilterHeaderAItemTextB}>{CurrencyFormatter(priceFilterText[1])}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.flexPriceFilterBody}>
                                                                <NickRangeSlider min={minPrice} max={maxPrice} value={priceFilter} onAfterChange={setPriceFilter} onChange={setPriceFilterText} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.flexFilterFooter}>
                                                    {/* {ratingFilter && <div className={styles.flexFilterWidth} onClick={() => handleRating(null)}><BtnB01 autoWidth={true}>Limpar</BtnB01></div>} */}
                                                    <div className={styles.flexFilterSeparator}></div>
                                                </div>
                                            </div>
                                        )}
                                        {adjustedIndex === 2 && (
                                            <div className={styles.flexFilter}>
                                                <div className={styles.flexFilterHeader}>
                                                    <h3 className={styles.flexFilterTitle}>Avaliações</h3>
                                                </div>
                                                <div className={styles.flexFilterBody}>
                                                    {Array.from(Array(4), (_, index) => index + 1).map((index) => (
                                                        <div className={styles.flexFilterItem} key={index} onClick={() => handleRating(index)}>
                                                            <StarRating rate={index} />
                                                            <span className={styles.flexFilterDescription}>e acima</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={styles.flexFilterFooter}>
                                                    {ratingFilter && <div className={styles.flexFilterWidth} onClick={() => handleRating(null)}><BtnB01 autoWidth={true}>Limpar</BtnB01></div>}
                                                    {adjustedIndex !== filters.length && <div className={styles.flexFilterSeparator}></div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {products.length > 0 ? (
                            <div className={styles.containerProducts}>
                                <div className={styles.containerProductsBody}>
                                    {products.map((product) => (
                                        <SimpleProductCard 
                                            data={product} 
                                            key={product.id} 
                                            showDiscountPercentage={true} 
                                            showRating={true}
                                        />
                                    ))}
                                </div>
                                <div className={styles.containerProductsFooter}>
                                    <BarPagination 
                                        totalPageCount={totalPageCount} 
                                        currentPage={currentPage}
                                        onChange={setCurrentPage}
                                    />
                                    <div className={styles.containerProductsFooterItem}>
                                        <span>Itens por página</span>
                                        <SimpleSelect data={itemsPerPageData} value={itemsPerPage} onChange={setItemsPerPage} />
                                    </div>
                                </div>
                            </div>
                        ):(
                            <div className={styles.containerNotFound}>
                                <span>Nenhum produto encontrado!</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.footer}>
                        {categoriesData[0] && categoriesData[0].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[0].name} href='/' enableScroll={true} autoScroll={true}>
                                {categoriesData[0].products.map((product) => (
                                    <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} showRating={true} />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </div>
                </div>
            </div>
        </WidthLayout>
    )
}

export default SearchPage