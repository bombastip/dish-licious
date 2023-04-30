import ReactDOM from 'react-dom/client';
import AppWrapper from './AppWrapper';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppWrapper />
    </React.StrictMode>,
);
