import React from 'react'
import { PiStar, PiStarFill, PiStarHalfFill } from 'react-icons/pi';
import styles from "./StarRating.module.css"

type Props = {
    rate: number
}

const StarRating = ({ rate }: Props) => {
    return (
        <div className={styles.wrapper}>
            {Array.from(Array(5), (_, index) => index + 1).map(index => {
                if(index <= Math.floor(rate)){
                    return (
                        <PiStarFill className={styles.star} key={index} />
                    )
                }else if (rate > Math.floor(rate) && index === Math.floor(rate) + 1){
                    return (
                        <PiStarHalfFill className={styles.star} key={index} />
                    )
                }else{
                    return (
                        <PiStar className={styles.star} key={index} />
                    )
                }
            })}
        </div>
    )
}

export default StarRating