import React, { useEffect, useState } from 'react'
import styles from "./RedirectErrorResponseMessage.module.css"
import { PiCheck } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import BtnA01 from '../../Buttons/BtnA01/BtnA01';


type Props = {
    seconds: number
    path: string
    title: string
    text: string
}

const RedirectErrorResponseMessage = ({ seconds, path, title, text }: Props) => {
    const [timeLeft, setTimeLeft] = useState<number>(seconds)
    const navigate = useNavigate()


    useEffect(() => {
        let interval: NodeJS.Timeout;

        // Função para atualizar o intervalo
        const updateInterval = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
            }, 1000); // Atualiza a cada segundo
        };

        // Inicializa o intervalo
        updateInterval();

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(interval);
    }, [seconds]); // Recriar o intervalo sempre que seconds mudar

    useEffect(() => {
        if(timeLeft === 0) {
            navigate(path);
        }
    }, [timeLeft, path, navigate]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.flexIcon}>
                    <PiCheck className={styles.icon} />
                </div>
                <div className={styles.flexItem}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.text}>{text}</span>
                    <span className={styles.text}>Você será redirecionando em {timeLeft} segundos...</span>
                    <BtnA01 href={path}>Ir para página</BtnA01>
                </div>
            </div>
        </div>
    )
}

export default RedirectErrorResponseMessage