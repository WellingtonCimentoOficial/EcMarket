import React, { useState } from 'react'
import styles from "./NickRangeSlider.module.css"
import ReactSlider from 'react-slider'

type Props = {
    value: [number, number]
    min: number
    max: number
    onChange: React.Dispatch<React.SetStateAction<[number, number]>>
}

const NickRangeSlider = ({value, min, max, onChange}: Props) => {

    const handleChange = (value: [number, number], index: number) => {
        onChange(value)
    }

    const renderTrack = (props: any, state: any) => {
        const trackClassName = state.index === 0 ? styles.track1 : state.index === 1 ? styles.track2 : styles.track0;
        return <div {...props} className={`${styles.track} ${trackClassName}`}/>
    }

    return (
        <div className={styles.wrapper}>
            <ReactSlider
                className={styles.horizontalSlider}
                thumbClassName={styles.thumb}
                trackClassName={styles.track}
                thumbActiveClassName={styles.thumbActive}
                markClassName={styles.mark}
                min={min}
                max={max}
                value={value}
                onAfterChange={handleChange}
                // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={10}
                renderTrack={renderTrack}
            />
        </div>
    )
}

export default NickRangeSlider