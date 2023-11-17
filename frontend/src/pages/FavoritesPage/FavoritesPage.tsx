import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

type Props = {}

const FavoritesPage = (props: Props) => {
    const { tokens } = useContext(AuthContext)

    useEffect(() => {
        console.log('favoites', tokens.refresh)
    }, [tokens.refresh])

    return (
        <div>FavoritesPage {tokens.refresh}</div>
    )
}

export default FavoritesPage