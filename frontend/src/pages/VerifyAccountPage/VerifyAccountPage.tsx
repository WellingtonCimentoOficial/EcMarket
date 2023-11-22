import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { axios } from '../../services/api'
import * as originalAxios from 'axios'

type Props = {}

const VerifyAccountPage = (props: Props) => {
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const code = searchParams.get('code')
    const [message, setMessage] = useState<{title: string, text: string, isError: boolean} | null>(null)

    const verify_account = useCallback(async () => {
        try {
            const response = await axios.post(`/accounts/verify/`, {code})
            if(response.status === 200){
                setIsVerified(true)
            }
        } catch (error) {
            if(originalAxios.isAxiosError(error)){
                if(error?.response?.data.cod === 12){
                    setMessage({
                        title: 'Código Expirado',
                        text: 'O código de verificação está expirado.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 13){
                    setMessage({
                        title: 'Formato Inválido',
                        text: 'O formato do código de verificação é inválido.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 14){
                    setMessage({
                        title: 'Conta já verificada',
                        text: 'A conta portadora do código de verificação ja foi validada.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 15){
                    setMessage({
                        title: 'Código Inválido',
                        text: 'O código de verificação informado é inválido.',
                        isError: true
                    })
                }else if(error?.response?.data.cod === 16){
                    setMessage({
                        title: 'Código não encontrado',
                        text: 'O código de verificação não foi encontrado.',
                        isError: true
                    })
                }else{

                }
            }
        }
    }, [code])

    useEffect(() => {verify_account()}, [verify_account])

    return (
        <div>
            VerifyAccountPage
            {isVerified ? 'Verificadaaaa' : message?.text}
        </div>
    )
}

export default VerifyAccountPage