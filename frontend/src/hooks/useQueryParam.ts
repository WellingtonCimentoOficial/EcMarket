import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type ArgsAddParam = (key: string, value: string) => void
type ArgsRemoveParam = (key: string) => void

export const useQueryParam = (): { addParam: ArgsAddParam, removeParam: ArgsRemoveParam} => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const addParam: ArgsAddParam = (key, value) => {
        if(searchParams.get(key)){
            searchParams.set(key, value)
        }else{
            searchParams.append(key, value)
        }
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }

    const removeParam: ArgsRemoveParam = (key) => {
        if(searchParams.get(key)){
            searchParams.delete(key)
        }
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }

    return {addParam, removeParam}
}