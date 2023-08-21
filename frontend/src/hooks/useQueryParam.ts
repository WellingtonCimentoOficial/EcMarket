import React from 'react'
import { useSearchParams } from 'react-router-dom';

type ArgsAddParam = (key: string, value: string) => void
type ArgsRemoveParam = (key: string) => void

export const useQueryParam = (): { addParam: ArgsAddParam, removeParam: ArgsRemoveParam} => {
    const [searchParams, setSearchParams] = useSearchParams();

    const addParam: ArgsAddParam = (key, value) => {
        const currentParams = new URLSearchParams(searchParams.toString())
        if(searchParams.has(key)){
            if(value !== searchParams.get(key)){
                currentParams.set(key, value)
                setSearchParams(currentParams)
                return
            }
        }else{
            currentParams.append(key, value)
            setSearchParams(currentParams)
        }
    }

    const removeParam: ArgsRemoveParam = (key) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        if(searchParams.has(key)){
            currentParams.delete(key)
            setSearchParams(currentParams)
        }
    }

    return {addParam, removeParam}
}