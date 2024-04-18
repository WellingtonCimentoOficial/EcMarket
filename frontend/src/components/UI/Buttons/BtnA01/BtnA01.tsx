import styles from "./BtnA01.module.css"

type Props = {
    href: string
    autoWidth?: boolean
    children: React.ReactNode
    disabled?: boolean
    onClick?: () => void
}

const BtnA01 = ({ autoWidth, href, children, disabled, onClick}: Props) => {
    return (
        <div onClick={() => onClick && onClick()} className={`${styles.wrapper} ${autoWidth ? styles.AutoWidth : null} ${disabled ? styles.disabled : null}`}>
            <a className={`${styles.BtnA01} ${autoWidth ? styles.AutoWidth : null}`} href={href}>{children}</a>
        </div>
    )
}

export default BtnA01