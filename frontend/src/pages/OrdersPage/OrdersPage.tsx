import React from 'react'
import WidthLayout from '../../layouts/WidthLayout/WidthLayout'
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout'

type Props = {}

const OrdersPage = (props: Props) => {
    return (
        <WidthLayout width={90}>
            <ProfileLayout title='Trocar senha' text='Para a segurança da sua conta, não compartilhe sua senha com mais ninguém'>
                <div>OrdersPage</div>
            </ProfileLayout>
        </WidthLayout>
    )
}

export default OrdersPage