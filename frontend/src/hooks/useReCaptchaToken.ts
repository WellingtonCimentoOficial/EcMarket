import { useCallback, useState } from "react"
import { useIsScriptAlreadyAdded } from "./useIsScriptAlreadyAddes"

type callbackProps = { 
    RecaptchaToken: string, 
    GoogleToken: string 
}

export const useReCaptchaToken = () => {
    const reCaptchaToken = process.env.REACT_APP_RE_CAPTCHA_TOKEN || ''
    const [recaptchaScriptLoaded, setRecaptchaScriptLoaded] = useState<boolean>(false)

    const { isScriptAlreadyAdded } = useIsScriptAlreadyAdded()

    const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${reCaptchaToken}`

    const getCaptchaToken = useCallback(async (callback : (props: any) => void, { GoogleToken } : { GoogleToken?: string } = {}) => {
        window.grecaptcha?.ready(function() {
            window.grecaptcha.execute(reCaptchaToken, {action: 'submit'}).then(function(token) {
                const callbackArgs: string | callbackProps = GoogleToken ? { RecaptchaToken: token, GoogleToken: GoogleToken } : token
                callback(callbackArgs)
            })
        })
    }, [reCaptchaToken])

    const initializeRecaptchaScript = useCallback(async () => {
        if(!isScriptAlreadyAdded(scriptSrc)){
            if(reCaptchaToken !== ''){
                const script = document.createElement('script')
                script.src = scriptSrc
                script.async = false
                document.head.appendChild(script)
        
                script.onload = () => {
                    setRecaptchaScriptLoaded(true)
                }
            }
        }else{
            setRecaptchaScriptLoaded(true)
        }
    }, [reCaptchaToken, isScriptAlreadyAdded , scriptSrc])

    return { reCaptchaToken, recaptchaScriptLoaded, initializeRecaptchaScript, getCaptchaToken }
}