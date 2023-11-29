import { useEffect } from 'react';
import './App.css';
import { LoadingContextProvider } from './contexts/LoadingContext';
import Routes from './routes';
import { ZipCodeProvider } from './contexts/ZipCodeContext';
import { AuthContextProvider } from './contexts/AuthContext';
import { ReCaptchaInterface } from './types/ReCaptchaType'
import { GoogleInterface } from './types/GoogleType'
import { AppleInterface } from './types/AppleType'
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext';

declare global {
    interface Window {
        grecaptcha: ReCaptchaInterface
        google: GoogleInterface
        AppleID: AppleInterface
    }
}

function App() {
    useEffect(() => {document.title = process.env.REACT_APP_PROJECT_NAME || document.title}, [])
    return (
        <div className="App">
            <BrowserRouter>
                <AuthContextProvider>
                    <UserContextProvider>
                        <LoadingContextProvider>
                            <ZipCodeProvider>
                                <Routes />
                            </ZipCodeProvider>
                        </LoadingContextProvider>
                    </UserContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </div>
    )
}

export default App;