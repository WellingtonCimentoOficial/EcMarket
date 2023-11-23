import { useEffect, useState, useCallback } from "react"

export const useReCaptchaToken = () => {
    const reCaptchaToken = process.env.REACT_APP_RE_CAPTCHA_TOKEN || ''
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

    const getCaptchaToken = useCallback(async (func : (CaptchaToken : string) => void) => {
        window.grecaptcha.ready(function() {
            window.grecaptcha.execute(reCaptchaToken, {action: 'submit'}).then(function(token) {
                func(token)
            })
        })
    }, [reCaptchaToken])

    useEffect(() => {
        if(reCaptchaToken){
            const script = document.createElement('script')
            script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaToken}`
            script.async = false
            document.head.appendChild(script)
    
            script.onload = () => setScriptLoaded(true)
        }
    }, [reCaptchaToken])

    return { reCaptchaToken, scriptLoaded, getCaptchaToken }
}