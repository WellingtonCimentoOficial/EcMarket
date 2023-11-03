import React, { useCallback } from 'react'

type FuctionArgs = {
    updateTitle: (title: string) => void
    deleteTitle: () => void
}

export const usePageTitleChanger = (): FuctionArgs => {
    const updateTitle = useCallback((title: string) => {
        if(title !== ""){
            const newTitle = title
            document.title = newTitle
        }
    }, [])

    const deleteTitle = () => {
        document.title = ""
    }

    return {
        updateTitle,
        deleteTitle
    }
}