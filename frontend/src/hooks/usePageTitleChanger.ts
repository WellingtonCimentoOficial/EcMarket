import React from 'react'

type FuctionArgs = {
    updateTitle: (title: string) => void
    deleteTitle: () => void
}

export const usePageTitleChanger = (): FuctionArgs => {
    const updateTitle = (title: string) => {
        if(title !== ""){
            const newTitle = title
            document.title = newTitle
        }
    }

    const deleteTitle = () => {
        document.title = ""
    }

    return {
        updateTitle: updateTitle,
        deleteTitle: deleteTitle
    }
}