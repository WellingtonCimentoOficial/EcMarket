import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type Args = (key: string, value: string) => void

export const useAddQueryParam = (): Args => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const addQueryParam: Args = (key, value) => {
        
        if(searchParams.get(key)){
            searchParams.set(key, value)
        }else{
            searchParams.append(key, value)
        }
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
    return addQueryParam
}