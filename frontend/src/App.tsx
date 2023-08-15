import './App.css';
import { LoadingContextProvider } from './contexts/LoadingContext';
import Routes from './routes';

function App() {
    return (
        <div className="App">
            <LoadingContextProvider>
                <Routes />
            </LoadingContextProvider>
        </div>
    )
}

export default App;