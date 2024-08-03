import React, { useState, useEffect, useCallback } from 'react'
import styles from "./HomePage.module.css"
import NiceCarousel from '../../components/UI/Carousels/NiceCarousel/NiceCarousel'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/UI/ProductCards/SimpleProductCard/SimpleProductCard'
import { Category } from '../../types/CategoryType'
import MacBanner from '../../components/UI/Banners/MacBanner/MacBanner'
import BoxBanner from '../../components/UI/Banners/BoxBanner/BoxBanner'
import BoxAccordion from '../../components/UI/Accordions/BoxAccordion/BoxAccordion'
import LuminexBanner from '../../components/UI/Banners/LuminexBanner/LuminexBanner'
import StyledSectionA from '../../styles/StyledSectionA'
import { useCategoriesRequests } from '../../hooks/useBackendRequests'
import { BannerType } from '../../types/BannerType'
import { axios } from '../../services/api'

const HomePage = (): JSX.Element => {
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const [carouselData, setCarouselData] = useState<BannerType[]>([])
    const {  getCategories } = useCategoriesRequests()

    const macBannerData = {
        title: "Whisky Chivas Regal 12 anos Blended Escocês",
        description: `O chivas regal 12 anos é uma combinação de diferentes tipos de maltes e grãos, todos maturados por no mínimo 12 anos. Essa combinação rica e suave consegue equilibrar estilo com conteúdo e tradição com um toque moderno.`,
        image: "https://www.arenaatacado.com.br/on/demandware.static/-/Sites-storefront-catalog-sv/default/dwc116773d/Produtos/18021-5000299601402-whisky%20chivas%2012%20anos%201l-chivas-3.jpg",
        buttonText: "Compre já",
        path: "/"
    }

    const commonQuestions = [
        {
            title: "How does Back Market guarantee quality?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nemo, cum earum, consectetur est recusandae id, fugiat minima incidunt quas odit. Magnam dicta corporis, deleniti totam inventore at quisquam optio."
        },
        {
            title: "How does Back Market guarantee quality?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nemo, cum earum, consectetur est recusandae id, fugiat minima incidunt quas odit. Magnam dicta corporis, deleniti totam inventore at quisquam optio."
        },
        {
            title: "How does Back Market guarantee quality?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nemo, cum earum, consectetur est recusandae id, fugiat minima incidunt quas odit. Magnam dicta corporis, deleniti totam inventore at quisquam optio."
        },
        {
            title: "How does Back Market guarantee quality?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nemo, cum earum, consectetur est recusandae id, fugiat minima incidunt quas odit. Magnam dicta corporis, deleniti totam inventore at quisquam optio."
        },
        {
            title: "How does Back Market guarantee quality?",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit nemo, cum earum, consectetur est recusandae id, fugiat minima incidunt quas odit. Magnam dicta corporis, deleniti totam inventore at quisquam optio."
        },
    ]

    const getHomeBanners = useCallback(async () => {
        try {
            const response = await axios.get("/banners/home/")
            if(response.status === 200) {
                setCarouselData(response.data)
            }
        } catch (error) {
        }
    }, [])

    useEffect(() => {getHomeBanners()}, [getHomeBanners])

    useEffect(() => {
        getCategories({
            limit: 6,
            callback: (data: Category[]) => setCategoriesData(data)
        })
    }, [getCategories])

    return (
        <>
            <WidthLayout>
                <NiceCarousel autoScroll scrollInterval={30000} data={carouselData} random />
            </WidthLayout>
            <WidthLayout width={75}>
                {categoriesData &&
                    <>
                        <StyledSectionA>
                            {categoriesData[0] && categoriesData[0].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[0].name} href={`/search?q=&categories=${categoriesData[0].id}`} enableScroll autoScroll>
                                    {categoriesData[0].products.map((product) => (
                                        <SimpleProductCard key={product.id} product={product} showDiscountPercentage showRating />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </StyledSectionA>
                        <StyledSectionA>
                            {categoriesData[1] && categoriesData[1].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[1].name} href={`/search?q=&categories=${categoriesData[1].id}`}>
                                    {categoriesData[1].products.slice(0, 10).map((product) => (
                                        <SimpleProductCard key={product.id} product={product} showDiscountPercentage showRating />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </StyledSectionA>
                    </>
                }
                <StyledSectionA>
                    <MacBanner data={macBannerData} inverse />
                </StyledSectionA>
                {categoriesData &&
                    <StyledSectionA>
                        {categoriesData[2] && categoriesData[2].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[2].name} href={`/search?q=&categories=${categoriesData[2].id}`} enableScroll autoScroll>
                                {categoriesData[2].products.map((product) => (
                                    <SimpleProductCard key={product.id} product={product} showDiscountPercentage showRating />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </StyledSectionA>
                }
                <StyledSectionA>
                    {categoriesData[3] && categoriesData[3].products.length >= 6 && (
                        <HeaderAndContentLayout title={categoriesData[3].name} href={`/search?q=&categories=${categoriesData[3].id}`}>
                            <BoxBanner products={categoriesData[3].products} />
                        </HeaderAndContentLayout>
                    )}
                </StyledSectionA>
                {categoriesData &&
                    <StyledSectionA>
                        {categoriesData[4] && categoriesData[4].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[4].name} href={`/search?q=&categories=${categoriesData[4].id}`} enableScroll autoScroll>
                                {categoriesData[4].products.map((product) => (
                                    <SimpleProductCard key={product.id} product={product} showDiscountPercentage showRating />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </StyledSectionA>
                }
                <StyledSectionA>
                    <div className={styles.center} style={{gap: "10px"}}>
                        <LuminexBanner
                            image='https://support.apple.com/content/dam/edam/applecare/images/en_US/psp_heros/hero-banner-apple-pay.image.large_2x.jpg'
                            title='We’re B-Corp certified We’re B-Corp certified We’re B-Corp'
                            description='Being a B-Corp means that we walk the walk when it comes to everything from our environmental impact to our hiring practices.'
                            href='/'
                            btnText='Quero conhecer'
                        />
                        <LuminexBanner
                            image='https://techcrunch.com/wp-content/uploads/2022/09/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-hero-220907_Full-Bleed-Image.jpg.large_2x.jpg?w=730&crop=1'
                            title='We’re B-Corp certified'
                            description='Being a B-Corp means that we walk the walk when it comes to everything from our environmental impact to our hiring practices practices.Being a B-Corp means that we walk the walk when it comes to everything from our environmental impact to our hiring practices practices.'
                            href='/'
                            btnText='Quero conhecer'
                        />
                        <LuminexBanner
                            image='https://cdn.arstechnica.net/wp-content/uploads/2022/09/Screenshot-2022-09-07-at-1.25.39-PM.jpeg'
                            title='We’re B-Corp certified'
                            description='Being a B-Corp means that we walk the walk when it comes to everything from our environmental impact to our hiring practices.'
                            href='/'
                            btnText='Quero conhecer'
                        />
                    </div>
                </StyledSectionA>
                {categoriesData &&
                    <StyledSectionA>
                        {categoriesData[5] && categoriesData[5].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[5].name} href={`/search?q=&categories=${categoriesData[5].id}`} enableScroll autoScroll>
                                {categoriesData[5].products.map((product) => (
                                    <SimpleProductCard key={product.id} product={product} showDiscountPercentage showRating />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </StyledSectionA>
                }
                <StyledSectionA>
                    <div className={styles.center}>
                        <BoxAccordion 
                        title='Perguntas frequentes' 
                        description='4 perguntas que as pessoas mais fazem' 
                        data={commonQuestions} />
                    </div>
                </StyledSectionA>
            </WidthLayout>
        </>
    )
}

export default HomePage