import React from 'react'
import styles from './LabelInput.module.css'

type Props = {
    type: 'text' | 'password' | 'email'
    name: string
    id: string
    minLength?: number
    maxLength?: number
    className?: string | null
    labelClassName?: string | null
    value: string
    labelText: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const LabelInput = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
        <div className={`${styles.container} ${props.disabled ? styles.disabled : null}`}>
            <span className={`${styles.inputLabel} ${props.invalid ? styles.invalidInputLabel : null} ${props.labelClassName}`}>{props.labelText}</span>
            <input 
                ref={ref}
                type={props.type} 
                name={props.name} 
                id={props.id}
                minLength={props.minLength}
                maxLength={props.maxLength}
                className={`${styles.input} ${props.invalid ? styles.invalidInput : null} ${props.className}`}
                onChange={props.onChange}
                value={props.value}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
        </div>
    )
})

export default LabelInput