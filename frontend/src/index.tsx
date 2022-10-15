import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './Containers/AppWrapper';
// import App from './Containers/App';
import reportWebVitals from './reportWebVitals';
import { SocketClient, SocketContext } from './Utilities/Classes/SocketClient';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// const socketClient = new SocketClient("http://192.168.1.91:3001");
// socketClient.listenToEvents();
console.log("aaa")
root.render(
  <React.StrictMode>
    {/* <SocketContext.Provider value={socketClient}> */}
      <AppWrapper />
    {/* </SocketContext.Provider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
