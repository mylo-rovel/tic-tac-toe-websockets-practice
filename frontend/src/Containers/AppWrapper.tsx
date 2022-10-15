import React from 'react';
import { SocketContext } from '../Utilities/Classes/SocketClient';
import App from './App';

function AppWrapper() {
  // const [scktClient] = useState(new SocketClient(API_ENDPOINT));
  // const [scktClient] = useState(io(API_ENDPOINT));
  const scktClient = React.useContext(SocketContext);
  console.log("connect");

  React.useEffect(() => {
    return () => {
      // console.log("disconnect");
      // scktClient.disconnectSocket();
      // scktClient.closeSocket();
    };
  }, [scktClient]);

  return ( 
  <>
    {/* <SocketContext.Provider value = {scktClient}> */}
      <button onClick={() => scktClient.emitEvent("testing1", {palta:2})}>
        tocameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      </button>
      <App />
    {/* </SocketContext.Provider> */}
  </> );
}

export default AppWrapper;