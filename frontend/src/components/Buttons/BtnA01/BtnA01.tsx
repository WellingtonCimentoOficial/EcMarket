import styles from "./BtnA01.module.css"

type Props = {
    href: string
    children: React.ReactNode
}

const BtnA01 = ({href, children}: Props) => {
    return (
        <a className={styles.BtnA01} href={href}>{children}</a>
    )
}

export default BtnA01