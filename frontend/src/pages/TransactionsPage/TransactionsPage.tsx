import React from 'react'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'

type Props = {}

const TransactionsPage = (props: Props) => {
    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <div>TransactionsPage</div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default TransactionsPage