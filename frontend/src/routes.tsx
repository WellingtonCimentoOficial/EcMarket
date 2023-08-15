import { BrowserRouter, Routes as RoutesRouter, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import HomePage from './pages/HomePage/HomePage'
import SearchPage from './pages/SearchPage/SearchPage'

const Routes = (): JSX.Element => {
    return (
        <BrowserRouter>
            <RoutesRouter>
                <Route path='/' element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path='search' element={<SearchPage />} />
                </Route>
            </RoutesRouter>
        </BrowserRouter>
    )
}

export default Routes