import { useCallback } from 'react'

export const useIsScriptAlreadyAdded = () => {
    const isScriptAlreadyAdded = useCallback((src: string) => {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === src) {
                return true;
            }
        }
        return false;
    }, [])

    return { isScriptAlreadyAdded }
}