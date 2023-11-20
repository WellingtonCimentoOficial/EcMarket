import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

type Props = {}

const FavoritesPage = (props: Props) => {
    const { tokens } = useContext(AuthContext)

    return (
        <div>FavoritesPage {tokens.refresh}</div>
    )
}

export default FavoritesPage