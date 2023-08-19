import React from 'react'

type FuctionArgs = {
    updateTitle: (title: string) => void
    deleteTitle: () => void
}

export const usePageTitleChanger = (): FuctionArgs => {
    const updateTitle = (title: string) => {
        if(title !== ""){
            const currentTitle = document.title
            const newTitle = `${title} | ${currentTitle}`
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