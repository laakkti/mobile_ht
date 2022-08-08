// npx react-native run-android

import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button} from 'react-native';
import type {Node} from 'react';
import {
  getIpAddress,
  getBatteryLevel,
  getUsedMemory,
  getTotalMemory,
} from './Deviceinfo';
import {getLocation} from './GeoLocation';
import axios from 'axios';
import base64 from 'react-native-base64';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const getConfig = token => {
  let _token = `Bearer ${token}`;
  const config = {
    headers: {Authorization: _token},
  };

  return config;
};

const userID = 'gtw.mob2@gmail.com';
const API_KEY = 'AIzaSyDpjvOEJNziJ2fRzXv50Xsu_IAk9jeaLCM';
const baseUrl = `https://gmail.googleapis.com/gmail/v1/users/${userID}/`;

const getScope = () => {
  return {
    scopes: ['https://mail.google.com/'], // [Android] what API you want to access on behalf of the user, default is email and profile
    webClientId:
      '935481118949-ortglfndok7149qcehltjev4mplietd2.apps.googleusercontent.com',
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    accountName: '', // [Android] specifies an account name on the device that should be used
    iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  };
};

const getMessages = async (subject, config) => {
  // GET https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages?q=Subject%3AInfo%20is%3Aunread&key=[YOUR_API_KEY] HTTP/1.1

  const query = `?q=Subject:${subject} is:unread`;
  //console.log(query);

  const response = await axios.get(baseUrl + 'messages' + query, config);
  //console.log(JSON.stringify(response));

  let messages = [];

  if(response.data.resultSizeEstimate!==0){
    
    let res = response.data.messages;
    messages = res.map(message => message.id);
  }
  return messages;
};

const markAsRead = async (msgId, config) => {
  let url = baseUrl + 'messages/' + msgId + '/modify' + '?key=' + API_KEY;
  console.log(url);

  let data = {
    removeLabelIds: ['UNREAD'],
  };

  try {
    const response = await axios.post(url, data, config);

    console.log(response.status);

    return response.status;
  } catch (e) {
    console.log('ERROR: ' + e.message);
    return 'ERROR: ' + e.message;
  }
};

const readMessage = async (msgId, config) => {
  // https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages/1816ccd8188828de?key=[YOUR_API_KEY] HTTP/1.1
  let url = baseUrl + 'messages/' + msgId + '?key=' + API_KEY;
  //console.log(url);
  try {
    const response = await axios.get(url, config);

    let data = response.data.payload.body.data;
    //console.log(data);

    const _data = base64.decode(data);
    let obj = JSON.parse(_data);

    return obj; //response.data;
  } catch (e) {
    console.log('on readMessage ERROR: ' + e.message);
    return 'on readMessage ERROR: ' + e.message;
  }
};

//const SOCKET_SERVER_URL = 'http://localhost:3000';
//const SOCKET_SERVER_URL = 'ws://192.168.43.249:3000';
// tämä kuten id saadaan emaililla
const SOCKET_SERVER_URL = 'ws://192.168.43.249:8080';
//const SOCKET_SERVER_URL = 'ws://127.0.0.1:8080';
//

const App: () => Node = () => {
  const [wss, setWss] = useState(0);
  const [location, setLocation] = useState(0);
  const [ipAddress, setIpAddress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [step, setStep] = useState(1);
  const [isConnection, setIsConnection] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function isSignedIn() {
      const val = await GoogleSignin.isSignedIn();

      //********************************
      /*
      if (val === true) {
        setStep(1);
      }*/
      setIsSignedIn(val);
    }
    isSignedIn();
    GoogleSignin.configure(getScope());
  }, []);

  /*const handleSendMessage = async () => {
    let accessToken = await getAccessToken();
    let config = getConfig(accessToken);
    let response = await sendMessage(config);
  };*/

  const getHandleMessages = async () => {
    let accessToken = await getAccessToken();
    //console.log('token= ' + accessToken);
    let config = getConfig(accessToken);

    let messages = await getMessages('query', config);
    console.log('messages=' + messages.length);

    if (messages.length > 0) {
      // HUOM ehkä olis parempi vanhin ei luettu eli messages[messages.length-1]
      let message = await readMessage(messages[messages.length - 1], config);

      await markAsRead(messages[messages.length - 1], config);

      //console.log(message);
      return message;
    } else {
      return '';
    }
  };

  const getAccessToken = async () => {
    const res = await GoogleSignin.getTokens();
    return res.accessToken;
  };

  const signIn = async () => {
    try {
      console.log('before sign');
      await GoogleSignin.hasPlayServices();

      const _userInfo = await GoogleSignin.signIn();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  let ws = null;

  const _getLocation = async () => {
    const loc = await getLocation();
    //setLocation(JSON.stringify(loc));
    setLocation(loc);
  };

  const _getIpAddress = async () => {
    const ip = await getIpAddress();
    setIpAddress(ip);
  };

  const _getBatteryLevel = async () => {
    const val = await getBatteryLevel();
    setBatteryLevel(val);
  };

  const _getUsedMemory = async () => {
    const val = await getUsedMemory();
    setUsedMemory(val);
  };

  const _getTotalMemory = async () => {
    const val = await getTotalMemory();
    setTotalMemory(val);
  };

  useEffect(() => {
    //update();
    ws = new WebSocket(SOCKET_SERVER_URL);

    ws.onopen = () => {
      // connection opened
      console.log('open');
      //***************
      setIsConnection(true);
      //setStep(1);

      //ws.send('open'); // send a message
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
      console.log('WS ERROR: ' + e.message);
    };

    ws.onclose = e => {
      // connection closed
      setIsConnection(false);
      console.log('onclose ' + e.code + ',' + e.reason);
    };

    setWss(ws);
    return () => {
      console.log('DISCONNECT');
      ws.close();
    };
  }, []);

  const update = () => {
    _getLocation();
    _getIpAddress();
    _getBatteryLevel();
    _getBatteryLevel();
    _getTotalMemory();
    _getUsedMemory();
  };

  useEffect(() => {
    update();
  }, []);

  // voisiko nämä olla useEffectin sisällä?
  //let message = '';

  async function step1() {
    console.log('step1 has started=' + isSignedIn);
    //await delay(2000);
    // muuta funktion nimi
    const message = await getHandleMessages();
    if (message !== '') {
      setMessage(message);
      console.log('message=' + JSON.stringify(message));
      console.log(
        '---------------------------------------------------------- ' +
          message.socketId,
      );
    }
    return message !== '';
    // oikeastaan pitäis luoda uusi socketyhteys messages.ip-osoitteeseen
  }

  async function step2() {
    update();
  }

  async function step3() {
    //console.log('on step3 message=' + JSON.stringify(message));
    //console.log('on step3 sending by socketio ' + message.socketId);
    handleSendSocketMessage(message.socketId);
    // await delay(1000);
    //await getHandleMessages();
  }

  /*
  async function step4() {
    await delay(5000);
  }*/

  // tänne ehdoksi, että websocket open ready tms.
  /*useEffect(() => {
    async function prog() {
      let ready=false;
      console.log('prog= ' + step);
      if (step === 1) {
        ready=await step1()
        setOk(ready);
        console.log('eka steppi'+ok);
      } else if (step === 2) {
        await step2();
      } else if (step === 3) {
        await step3();
        setOk(false);
      } else if (step === 4) {
        
        setStep(1);
      }
      if (ok || ready) {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzz "+step)
        if (step > 0 && step < 4) {
          setStep(step + 1);
        } else {
          console.log('set to 0 '+step);
          setStep(1); //
        }
        
      } else {
        if (step === 1) {
          setStep(4);
        }
      }
    }
    if (isConnection) {
      //if(step>0){
      console.log('isConnection= ' + isConnection);
      prog();
    }
  }, [step, isConnection]);*/

  useEffect(() => {
    async function prog() {
      let ready=false;
      console.log('prog= ' + step);
      if (step === 1) {
        const ok=await step1()
        if(!ok){
          setStep(0);
        }        
      } else if (step === 2) {
        await step2();
      } else if (step === 3) {
        await step3();
        setOk(false);
      } else if (step === 4) {
        
        setStep(1);
      }
        if (step > 0 && step < 4) {
          setStep(step + 1);
        } else if(step === 4) {
          setStep(1); 
        } else if (step === 0) {
          setStep(1);
        }              
    }
    if (isConnection) {            
      prog();
    }
  }, [step, isConnection]);

  const handleSendSocketMessage = async socketId => {
    // id saadaa emailista

    //location_lon:location.lon,
    //location_lat:location.lng,
    //lon:location.lon,
    // lat:location.lng,
    // :{location.lon,location.lng},

    const message = {
      sender: 'mob',
      location,
      id: socketId,
      ipAddress: ipAddress,
      batteryLevel: batteryLevel,
      usedMemory: usedMemory,
      totalMemory: totalMemory,
      time: Date.now(),
    };

    console.log('message=' + JSON.stringify(message));
    wss.send(JSON.stringify(message));
  };

  const handleUpdate = async () => {
    update();
  };

  const handleReadMessages = async () => {
    setStep(1);
    setIsConnection(true);
  };

  return (
    <SafeAreaView>
      <View>
        {!isSignedIn ? (
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            //disabled={this.state.isSigninInProgress}
          />
        ) : (
          <View>
            <Button
              title="Send socket-message"
              onPress={handleSendSocketMessage}
            />
            <Button title="update" onPress={handleUpdate} />
            <Button title="ReadMessages" onPress={handleReadMessages} />
            <Text>
              {location.lat} , {location.lon}
            </Text>
            <Text>{ipAddress}</Text>
            <Text>{batteryLevel}</Text>
            <Text>
              {usedMemory}/{totalMemory}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
