import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppRedux from './AppRedux';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Sử dụng AppRedux cho demo Redux
root.render(<AppRedux />);
