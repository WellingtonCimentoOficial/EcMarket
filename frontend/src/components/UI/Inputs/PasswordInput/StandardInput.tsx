import React, { useEffect, useRef, useState } from 'react'
import styles from './StandardInput.module.css'
import { PiKeyBold, PiEyeBold, PiEyeSlashBold, PiEnvelope, PiUserBold } from "react-icons/pi";


type Props = {
    value: string
    isValid?: boolean
    focus?: boolean
    required?: boolean
    name?: string
    id?: string
    placeholder: string
    minLength?: number
    maxLength?: number
    disabled?: boolean
    label: string
    type: "username" | "email" | "password"
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

const StandardInput = (props: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if(props.focus){
            inputRef.current?.focus()
        }
    }, [props.focus])

    return (
        <div className={styles.containerBodyFormInputContainer}>
            <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconLeft}`}>
                {props.type === "password" && <PiKeyBold className={styles.containerBodyFormInputContainerIconIcon} />}
                {props.type === "username" && <PiUserBold className={styles.containerBodyFormInputContainerIconIcon} />}
                {props.type === "email" && <PiEnvelope className={styles.containerBodyFormInputContainerIconIcon} />}
            </div>
            <span className={styles.containerBodyFormInputContainerLabel}>{props.label}</span>
            <input 
                ref={inputRef}
                className={`${styles.containerBodyFormInputContainerInput} ${!props.isValid ? styles.containerBodyFormInputContainerInputError : null}`} 
                type={props.type === "password" ? (showPassword ? 'text' : 'password') : props.type} 
                name={props.name}
                id={props.id}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                minLength={props.maxLength}
                value={props.value}
                required
                disabled={props.disabled}
                onChange={props.onChange}
            />
            {props.type === "password" &&
                <div className={`${styles.containerBodyFormInputContainerIcon} ${styles.containerBodyFormInputContainerIconRight}`}>
                    {showPassword ? (
                        <PiEyeSlashBold 
                            className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                            onClick={() => setShowPassword(oldValue => !oldValue)}
                        />
                    ) : (
                        <PiEyeBold 
                        className={`${styles.containerBodyFormInputContainerIconIcon} ${styles.containerBodyFormInputContainerIconIconF}`} 
                        onClick={() => setShowPassword(oldValue => !oldValue)}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default StandardInput