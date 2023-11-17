import { BrowserRouter, Routes as RoutesRouter, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import HomePage from './pages/HomePage/HomePage'
import SearchPage from './pages/SearchPage/SearchPage'
import ProductPage from './pages/ProductPage/ProductPage'
import SecondaryLayout from './layouts/SecondaryLayout/SecondaryLayout'
import LoginPage from './pages/LoginPage/LoginPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import PrivateRoutes from './components/Controllers/PrivateRoutes'

const Routes = (): JSX.Element => {
    return (
        <BrowserRouter>
            <RoutesRouter>
                <Route path='/' element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path='search' element={<SearchPage />} />
                    <Route path=':productName/p/:productId' element={<ProductPage />} />
                    <Route element={<PrivateRoutes />}>
                        <Route path='/accounts/favorites' element={<FavoritesPage />} />
                    </Route>
                </Route>
                <Route path='/' element={<SecondaryLayout />}>
                    <Route path='/accounts/sign-in' element={<LoginPage />} />
                </Route>
            </RoutesRouter>
        </BrowserRouter>
    )
}

export default Routes