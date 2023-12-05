import React, { useState } from 'react'
import styles from "./SimpleSelect.module.css"
import { PiCaretDownLight, PiCaretUpLight } from 'react-icons/pi';
import { SelectType } from '../../../../types/SelectType';

type Props = {
    data: SelectType[]
    value: SelectType
    onChange: React.Dispatch<React.SetStateAction<SelectType>>
    className?: string
    invalid?: boolean
    disabled?: boolean
}

const SimpleSelect = ({ value, data, onChange, className, invalid, disabled }: Props) => {
    const [show, setShow] = useState<boolean>(false)

    return (
        <div className={`${styles.wrapper} ${disabled ? styles.disabled : null}`} tabIndex={1} onBlur={() => setShow(false)}>
            <div className={styles.container}>
                <div className={`${styles.header} ${className} ${invalid ? styles.invalid : null}`} onClick={() => setShow(value => !value)}>
                    <h4 className={styles.title}>{value.text}</h4>
                    {show ? <PiCaretUpLight /> : <PiCaretDownLight />}
                </div>
                <div className={`${styles.body} ${show ? styles.show : styles.hide}`}>
                    <ul className={styles.ul}>
                        {data.map((item, index) => (
                            <li className={styles.li} key={index} onClick={() => {onChange(item);setShow(false)}}>{item.text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SimpleSelect