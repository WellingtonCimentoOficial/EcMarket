import { Routes as RoutesRouter, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import HomePage from './pages/HomePage/HomePage'
import SearchPage from './pages/SearchPage/SearchPage'
import ProductPage from './pages/ProductPage/ProductPage'
import SecondaryLayout from './layouts/SecondaryLayout/SecondaryLayout'
import LoginPage from './pages/LoginPage/LoginPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import PrivateRoutes from './components/Controllers/PrivateRoutes'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import VerifyAccountPage from './pages/VerifyAccountPage/VerifyAccountPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import AddressesPage from './pages/AddressesPage/AddressesPage'
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage'
import CartPage from './pages/CartPage/CartPage'
import CardsPage from './pages/CardsPage/CardsPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import RatingsPage from './pages/RatingsPage/RatingsPage'
import TransactionsPage from './pages/TransactionsPage/TransactionsPage'

const Routes = (): JSX.Element => {
    return (
        <RoutesRouter>
            <Route path='/' element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path='search' element={<SearchPage />} />
                <Route path=':productName/p/:productId' element={<ProductPage />} />
                <Route element={<PrivateRoutes />}>
                    <Route path='/account/wishlist' element={<FavoritesPage />} />
                </Route>
            </Route>
            <Route path='/account/*'>
                <Route element={<SecondaryLayout />}>
                    <Route path='sign-in' element={<LoginPage />} />
                    <Route path='sign-up' element={<RegisterPage />} />
                    <Route path='verify' element={<VerifyAccountPage />} />
                    <Route path='reset/password' element={<ResetPasswordPage />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route element={<PrivateRoutes />}>
                        <Route path='profile' element={<ProfilePage />} />
                        <Route path='addresses' element={<AddressesPage />} />
                        <Route path='wishlist' element={<FavoritesPage />} />
                        <Route path='password/change' element={<ChangePasswordPage />} />
                        <Route path='cart' element={<CartPage />} />
                        <Route path='orders' element={<OrdersPage />} />
                        <Route path='ratings' element={<RatingsPage />} />
                        <Route path='cards' element={<CardsPage />} />
                        <Route path='transactions' element={<TransactionsPage />} />
                    </Route>
                </Route>
            </Route>
        </RoutesRouter>
    )
}

export default Routes

export const HOME_PATH = "/"
export const SIGN_IN_PATH = "/account/sign-in"
export const SIGN_UP_PATH = "/account/sign-up"