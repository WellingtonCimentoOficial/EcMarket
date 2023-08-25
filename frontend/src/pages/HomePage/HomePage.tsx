import React, { useState, useEffect, useContext } from 'react'
import styles from "./HomePage.module.css"
import NiceCarousel from '../../components/Carousels/NiceCarousel/NiceCarousel'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import HeaderAndContentLayout from '../../layouts/HeaderAndContentLayout/HeaderAndContentLayout'
import SimpleProductCard from '../../components/ProductCards/SimpleProductCard/SimpleProductCard'
import { Category } from '../../types/CategoryType'
import { axios } from '../../services/api'
import MacBanner from '../../components/Banners/MacBanner/MacBanner'
import BoxBanner from '../../components/Banners/BoxBanner/BoxBanner'
import BoxAccordion from '../../components/Accordions/BoxAccordion/BoxAccordion'
import LuminexBanner from '../../components/Banners/LuminexBanner/LuminexBanner'
import { LoadingContext } from '../../contexts/LoadingContext'

const HomePage = (): JSX.Element => {
    const [categoriesData, setCategoriesData] = useState<Category[]>([])
    const { setIsLoading } = useContext(LoadingContext)

    const carouselData = [
        {
            imageURL: "https://wearepolaris.sg/wp-content/uploads/2021/10/Apple_Watch_S7_Cell_Web_Banner_Avail_1400x700_Shop_AppleWatch.jpg",
            path: "/"
        },
        {
            imageURL: "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-iPhone-14-Plus-5up-hero-220907_Full-Bleed-Image.jpg.large.jpg",
            path: "/"
        },
        {
            imageURL: "https://9to5mac.com/wp-content/uploads/sites/6/2022/09/iPhone-14-wallpapers.jpg?quality=82&strip=all&w=1600",
            path: "/"
        },
    ]

    const macBannerData = {
        title: "Lançamento do novo Iphone 14 Prox Max",
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae magni ducimus voluptas recusandae consequuntur corrupti, rem iusto soluta quae fugiat qui dolorum! Impedit, libero labore placeat voluptatem eos eligendi ipsa.`,
        image: "https://www.smartprix.com/bytes/wp-content/uploads/2022/11/FiERK3lVEAEGyCO-photoutils.com_.jpeg",
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

    useEffect(() => {
        const get_categories = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/categories/?limit=6&min_product_count=10&max_product_count_param=20&random=true')
                if(response.status === 200){
                    setCategoriesData(response.data.results)
                }
                
            } catch (error) {
                setCategoriesData([])
            }
            setIsLoading(false)
        }
        get_categories()
    }, [setIsLoading])

    return (
        <>
            <WidthLayout>
                <NiceCarousel autoScroll={true} scrollInterval={30000} data={carouselData} />
            </WidthLayout>
            <WidthLayout width={75}>
                {categoriesData &&
                    <>
                        <section className={styles.sectionA}>
                            {categoriesData[0] && categoriesData[0].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[0].name} href='/' enableScroll={true} autoScroll={true}>
                                    {categoriesData[0].products.map((product) => (
                                        <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </section>
                        <section className={styles.sectionA}>
                            {categoriesData[1] && categoriesData[1].products.length > 0 && (
                                <HeaderAndContentLayout title={categoriesData[1].name} href='/'>
                                    {categoriesData[1].products.slice(0, 10).map((product) => (
                                        <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                    ))}
                                </HeaderAndContentLayout>
                            )}
                        </section>
                    </>
                }
                <section className={styles.sectionA}>
                    <MacBanner data={macBannerData} inverse={true} />
                </section>
                {categoriesData &&
                    <section className={styles.sectionA}>
                        {categoriesData[2] && categoriesData[2].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[2].name} href='/' enableScroll={true} autoScroll={true}>
                                {categoriesData[2].products.map((product) => (
                                    <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </section>
                }
                <section className={styles.sectionA}>
                    {categoriesData[3] && categoriesData[3].products.length >= 6 && (
                        <HeaderAndContentLayout title={categoriesData[3].name} href='/'>
                            <BoxBanner mainData={categoriesData[3].products[0]} data={categoriesData[3].products} />
                        </HeaderAndContentLayout>
                    )}
                </section>
                {categoriesData &&
                    <section className={styles.sectionA}>
                        {categoriesData[4] && categoriesData[4].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[4].name} href='/' enableScroll={true} autoScroll={true}>
                                {categoriesData[4].products.map((product) => (
                                    <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </section>
                }
                <section className={styles.sectionA}>
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
                </section>
                {categoriesData &&
                    <section className={styles.sectionA}>
                        {categoriesData[5] && categoriesData[5].products.length > 0 && (
                            <HeaderAndContentLayout title={categoriesData[5].name} href='/' enableScroll={true} autoScroll={true}>
                                {categoriesData[5].products.map((product) => (
                                    <SimpleProductCard key={product.id} data={product} showDiscountPercentage={true} />
                                ))}
                            </HeaderAndContentLayout>
                        )}
                    </section>
                }
                <section className={styles.sectionA}>
                    <div className={styles.center}>
                        <BoxAccordion 
                        title='Perguntas frequentes' 
                        description='4 perguntas que as pessoas mais fazem' 
                        data={commonQuestions} />
                    </div>
                </section>
            </WidthLayout>
        </>
    )
}

export default HomePage