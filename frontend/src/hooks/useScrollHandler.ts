import { useCallback, useState } from 'react'

type Props = {
    cont?: number,
    setCont?: React.Dispatch<React.SetStateAction<number>> 
    ref: React.RefObject<HTMLElement>
}

export const useScrollHandler = ({ cont, setCont, ref }: Props) => {
    const [isScrollbarAtEnd, setIsScrollbarAtEnd] = useState<boolean>(false)
    const [isScrollbarAtStart, setIsScrollbarAtStart] = useState<boolean>(true)
    const handleScroll = useCallback((direction: "next" | "previous") => {
        const element = ref && ref.current ? ref.current : false
        if(element){
            const { clientWidth, scrollWidth } = element
            const contMax: number = Math.round(scrollWidth / clientWidth)
            if(direction === "next"){
                if(cont){
                    if(cont < contMax){
                        element.scrollLeft = element.scrollLeft + clientWidth
                        setCont && setCont(value => value + 1)
                        setIsScrollbarAtStart(false)
                        setIsScrollbarAtEnd(cont + 2 >= contMax ? true : false)
                    }else{
                        element.scrollLeft = 0
                        setCont && setCont(1)
                        setIsScrollbarAtStart(true)
                        setIsScrollbarAtEnd(false)
                    }
                }else{
                    if(element.scrollLeft + clientWidth < scrollWidth){
                        element.scrollLeft = element.scrollLeft + clientWidth
                        setCont && setCont(value => value + 1)
                        setIsScrollbarAtStart(false)
                        setIsScrollbarAtEnd(element.scrollLeft + (clientWidth * 2) >= scrollWidth ? true : false)
                    }else{
                        element.scrollLeft = 0
                        setCont && setCont(1)
                        setIsScrollbarAtStart(true)
                        setIsScrollbarAtEnd(false)
                    }
                }
            }else{
                if(cont){
                    if(cont > 1){
                        element.scrollLeft = element.scrollLeft - clientWidth
                        setCont && setCont(value => value - 1)
                        setIsScrollbarAtStart(false)
                        setIsScrollbarAtEnd(cont + 2 >= contMax ? true : false)
                    }else{
                        element.scrollLeft = scrollWidth
                        setCont && setCont(contMax)
                        setIsScrollbarAtEnd(false)
                        setIsScrollbarAtStart(true)
                    }
                }else{
                    if(element.scrollLeft > 0){
                        element.scrollLeft = element.scrollLeft - clientWidth
                        setCont && setCont(value => value - 1)
                        setIsScrollbarAtStart(element.scrollLeft - (clientWidth * 2) <= 0 ? true : false)
                        setIsScrollbarAtEnd(false)
                    }else{
                        element.scrollLeft = scrollWidth
                        setCont && setCont(contMax)
                        setIsScrollbarAtEnd(true)
                        setIsScrollbarAtStart(false)
                    }
                }
            }
        }

    }, [cont, ref, setCont])
    

    return { 
        handleScroll,
        isScrollbarAtStart: isScrollbarAtStart,
        isScrollbarAtEnd: isScrollbarAtEnd,
    }
}