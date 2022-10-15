import { useEffect, useContext } from 'react';
import { SocketContext } from '../Utilities/Classes/SocketClient';
import App from './App';

function AppWrapper() {
  const socketClient = useContext(SocketContext);
  console.log(socketClient)

  useEffect(() => {
  },[socketClient]);
  
  console.log("bbb")
  return ( <App /> );
}

export default AppWrapper;