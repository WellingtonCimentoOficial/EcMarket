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
                        <Route path='orders' element={<ProfilePage />} />
                        <Route path='wishlist' element={<FavoritesPage />} />
                        <Route path='cart' element={<ProfilePage />} />
                        <Route path='cards' element={<ProfilePage />} />
                    </Route>
                </Route>
            </Route>
        </RoutesRouter>
    )
}

export default Routes