//importReact
import React from 'react';

//import navigation
import Navigation from './src/navigation';
import { ToastProvider } from 'react-native-toast-notifications';

const App = () => {
    return (
        <ToastProvider>
            <Navigation />
        </ToastProvider>
    );
}

export default App;