// npx react-native run-android

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {getIpAddress,getBatteryLevel,getUsedMemory,getTotalMemory} from './Deviceinfo';
import {getLocation} from './GeoLocation';
//import io from 'socket.io-client';

import {SafeAreaView, StyleSheet, Text, View, Button} from 'react-native';

//const SOCKET_SERVER_URL = 'http://localhost:3000';
//const SOCKET_SERVER_URL = 'ws://192.168.43.249:3000';
// tämä kuten id saadaan emaililla
const SOCKET_SERVER_URL = 'ws://192.168.43.249:8080';
//const SOCKET_SERVER_URL = 'ws://127.0.0.1:8080';
//

const App: () => Node = () => {
  const [location, setLocation] = useState(0);
  const [ipAddress, setIpAddress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);

  // ehkä kuitenkin paremöi asetttaa useEffectissä ??? ja [ws] loppuun effectin
  //const [ws, setWs] = useState(''); //new WebSocket(SOCKET_SERVER_URL));
  //const [ws, setWs] = useState(new WebSocket(SOCKET_SERVER_URL));

  //var ws = React.useRef(new WebSocket(SOCKET_SERVER_URL)).current;

  /*const handleMessage = React.useCallback(( data ) => {
    try {
      //const date = new Date(data);
      //setTime(date);
      //console.log("##### "+data);
      for(item in data){
        console.log(item);
      }

      console.log(data.data);
    } catch (err) {
      console.warn('error data', { data });
    }
  }, []);*/

  const ws = new WebSocket(SOCKET_SERVER_URL);
  //ws.binaryType = 'blob';

  /* 
 for(item in ws){
    console.log(item);
 }*/

  //§const ws=null;

  const getLoc = async () => {
    const loc = await getLocation();
    setLocation(JSON.stringify(loc));    
    //return loc
  };

  const _getIpAddress=async ()=>{
    const ip = await getIpAddress();
    setIpAddress(ip);
  }

  const _getBatteryLevel=async ()=>{
    
    const val = await getBatteryLevel();
    setBatteryLevel(val);
  }

  const _getUsedMemory=async ()=>{
    
    const val = await getUsedMemory();
    setUsedMemory(val);
  }

  const _getTotalMemory=async ()=>{
    
    const val = await getTotalMemory();
    setTotalMemory(val);
  }
  

  useEffect(() => {
    getLoc();
    _getIpAddress();
    _getBatteryLevel();
    _getBatteryLevel();
    _getTotalMemory();
    _getUsedMemory();
    //setLocation(JSON.stringify(getLoc()));    
    //setIpAddress(getIpAddress());
    //console.log(getIpAddress());
    //setWs(new WebSocket(SOCKET_SERVER_URL));
    //ws = new WebSocket(SOCKET_SERVER_URL);
    //!!!! ReactNative vaatii
    //ws.binaryType = 'blob';
    //ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      // connection opened
      console.log('open');
      ws.send('open'); // send a message
    };

    ws.onmessage = e => {
      // a message was received
      console.log('onmessage');
      //console.log(e);
      //const message = JSON.parse(e.data)
      //console.log(message);
      console.log(e.data);
    };

    //ws.onmessage = handleMessage;

    ws.onerror = e => {
      // an error occurred
      console.log('ERROR: ' + e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };

    return () => {
      console.log('DISCONNECT');
      ws.close();
    };
  }, []);

  // miksi async
  const handleSendSocketMessage = async () => {
    const id = 1;
    ws.send(
      JSON.stringify({sender: 'mob', id: id, temp: "21'C", time: Date.now()}),
    );
  };

  const handleGetLocation = async () => {
    //getLoc();
    console.log("call bat");
    _getBatteryLevel();
    
  };


  // <Deviceinfo />
  // <Text>{ipAddress}</Text>
  return (
    <SafeAreaView>
      <View>
        <Button title="Send socket-message" onPress={handleSendSocketMessage} />
        <Button title="getLocation" onPress={handleGetLocation} />
        <Text>{location}</Text>
        <Text>{ipAddress}</Text>        
        <Text>{batteryLevel}</Text>
        <Text>
        {usedMemory}/{totalMemory}
      </Text>        
      </View>
    </SafeAreaView>
  );
};

export default App;
