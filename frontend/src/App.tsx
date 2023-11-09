import { useEffect } from 'react';
import './App.css';
import { LoadingContextProvider } from './contexts/LoadingContext';
import Routes from './routes';
import { ZipCodeProvider } from './contexts/ZipCodeContext';

function App() {
    useEffect(() => {document.title = process.env.REACT_APP_PROJECT_NAME || document.title}, [])
    return (
        <div className="App">
            <LoadingContextProvider>
                <ZipCodeProvider>
                    <Routes />
                </ZipCodeProvider>
            </LoadingContextProvider>
        </div>
    )
}

export default App;