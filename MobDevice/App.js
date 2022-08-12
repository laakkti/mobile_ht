// npx react-native run-android

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from 'react-native';
import {LinearProgress} from 'react-native-elements';
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

import {SvgUri} from 'react-native-svg';
import SVGImg from './broadcast.svg';

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

  const response = await axios.get(baseUrl + 'messages' + query, config);

  let messages = [];

  if (response.data.resultSizeEstimate !== 0) {
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

  try {
    const response = await axios.get(url, config);

    let data = response.data.payload.body.data;

    const _data = base64.decode(data);
    let obj = JSON.parse(_data);

    return obj;
  } catch (e) {
    console.log('on readMessage ERROR: ' + e.message);
    return 'on readMessage ERROR: ' + e.message;
  }
};

//const SOCKET_SERVER_URL = 'ws://192.168.43.249:8080';

const App: () => Node = () => {
  const [wss, setWss] = useState(null);
  const [location, setLocation] = useState(0);
  const [ipAddress, setIpAddress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [freeMemory, setFreeMemory] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [step, setStep] = useState(1);
  const [isConnection, setIsConnection] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [levelColor, setLevelColor] = useState({});

  const [imgColor, setImgColor] = useState('#66b2b2');
  const [socketServerAddress, setSocketServerAddress] = useState(null);

  const [active, setActive] = useState(false);

  useEffect(() => {
    async function isSignedIn() {
      const val = await GoogleSignin.isSignedIn();
      setIsSignedIn(val);
    }
    isSignedIn();
    GoogleSignin.configure(getScope());
  }, []);

  const getHandleMessages = async () => {
    let accessToken = await getAccessToken();
    //console.log('token= ' + accessToken);
    let config = getConfig(accessToken);

    let messages = await getMessages('query', config);
    console.log('messages=' + messages.length);

    if (messages.length > 0) {
      let message = await readMessage(messages[messages.length - 1], config);
      await markAsRead(messages[messages.length - 1], config);
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

  const _getFreeMemory = async () => {
    const val2 = await getTotalMemory();
    const val = await getUsedMemory();
    setFreeMemory(1 - val / val2);
  };


  useEffect(() => {
    //if (socketServer !== null) {
    if (socketServerAddress !== null) {

      console.log('socketServerAddess=' + socketServerAddress);

      ws = new WebSocket(socketServerAddress);
      //ws = new WebSocket(SOCKET_SERVER_URL);

      ws.onopen = () => {
        console.log('open');
        setIsConnection(true);
      };

      ws.onmessage = e => {
        console.log('onmessage');
        console.log(e.data);
      };

      ws.onerror = e => {
        console.log('WS ERROR: ' + e.message);
      };

      ws.onclose = e => {
        setIsConnection(false);
      };

      setWss(ws);
    }
    /*
    return () => {
      //if (socketServer !== null) {
      if (socketServerAddress!==null) {
        console.log('DISCONNECT');
        ws.close();
      }
    };*/
  }, [socketServerAddress]);

  const setLevelColors = () => {
    let lc = {};

    let _freeMemory = freeMemory * 100;
    if (_freeMemory > 49) {
      lc.memory = '#2db83d';
    } else if (_freeMemory <= 49 && _freeMemory > 29) {
      lc.memory = '#FF6600';
    } else {
      lc.memory = '#FF0000';
    }

    let _batteryLevel = batteryLevel * 100;

    if (_batteryLevel > 49) {
      lc.battery = '#2db83d';
    } else if (_batteryLevel <= 49 && _batteryLevel > 29) {
      lc.battery = '#ff9a00';
    } else {
      lc.battery = '#FF0000';
    }
    setLevelColor(lc);
  };

  const update = () => {
    _getLocation();
    _getIpAddress();
    _getBatteryLevel();
    _getBatteryLevel();
    _getTotalMemory();
    _getUsedMemory();
    _getFreeMemory();
  };

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    setLevelColors();
  }, [batteryLevel, freeMemory]);

  async function step1() {
    const message = await getHandleMessages();
    if (message !== '') {
      setMessage(message);
      console.log('message=' + JSON.stringify(message));
      console.log(
        '---------------------------------------------------------- ' +
          message.socketId,
      );

      setSocketServerAddress('ws://' + message.ip);

    }
    return message !== '';
  }

  async function step2() {
    let ret;

    if (socketServerAddress !== null) {

      setImgColor('#00FF00');
      ret = true;
    } else {
      ret = false;
    }

    return ret; //(socketServer !== null);
  }

  async function step3() {
    update();
  }

  async function step4() {
    console.log('on step3 message=' + JSON.stringify(message));
  
    if (isConnection) {
      handleSendSocketMessage(message.socketId);
    }
    setImgColor('#66b2b2');
    return isConnection;

  }

  // jotta homma pyörii niin step pitää muuttua "joka kierroksella"
  useEffect(() => {
    async function prog() {
      console.log('step=' + step);

      if (step === 0) {
        update();
        setStep(1);
      } else if (step === 1) {
        const ok = await step1();
        if (!ok) {

          setStep(0);
        } else {

          setStep(step + 1);
        }
      } else if (step === 2) {
        const ok = await step2();
        if (!ok) {

          setStep(6);
        } else {
          setStep(step + 1);
        }
      } else if (step === 3) {
        await step3();
        setStep(step + 1);
      } else if (step === 4) {
        const ok = await step4();
        if (!ok) {
          setStep(7);
        } else {
          setStep(step + 1);
        }
      } else if (step === 5) {
        setStep(1);
      } else if (step === 6) {
        setStep(2);
      } else if (step === 7) {
        setStep(4);
      }
    }

    prog();

  }, [step, isConnection]);

  const handleSendSocketMessage = async socketId => {
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
    console.log('isConnection=' + isConnection);

    wss.send(JSON.stringify(message));
  };

  const handleUpdate = async () => {
    update();

  };

  const handleReadMessages = async () => {

  };

  // source={require('./broadcast.svg')}

  // <SafeAreaView style={{backgroundColor:'#008080'}}>

  // {({usedMemory}/{totalMemory})}
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {!isSignedIn ? (
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
        ) : (
          <View style={{marginTop: 50}}>
            {/*<Button
              title="Send socket-message"
              onPress={handleSendSocketMessage}
        />*/}
            {/*<Button title="update" onPress={handleUpdate} />*/}
            {/*<Button title="ReadMessages" onPress={handleReadMessages} />*/}

            <Text style={styles.label}>Location</Text>
            <View style={styles.horizontal}>
              <Text style={styles.value}>{location.lat}</Text>
              <Text style={styles.value}>{location.lon}</Text>
            </View>
            <Text style={styles.label}>Ip address</Text>
            <Text style={styles.value}>{ipAddress}</Text>
            <View style={styles.horizontal}>
              <Text style={styles.label}>Battery</Text>
              <Text style={styles.value}>
                {Math.round(batteryLevel * 100)}%
              </Text>
            </View>
            <LinearProgress
              variant="determinate"
              color={levelColor.battery}
              value={batteryLevel}
              style={{marginBottom: 10, height: 20}}
            />
            <View style={styles.horizontal}>
              <Text style={styles.label}>Memory</Text>
              <Text style={styles.value}>{Math.round(freeMemory * 100)}%</Text>
            </View>
            <LinearProgress
              variant="determinate"
              color={levelColor.memory}
              value={freeMemory}
              style={{marginBottom: 10, height: 20}}
            />

            <View>
              <SVGImg
                width="200"
                height="200"
                color={imgColor}
                alignSelf="center"
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// pois
//flexDirection:'row',
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3E4C',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flex: 0,
    flexDirection: 'row',
  },
  label: {
    color: '#FFFFFF',
  },
  value: {
    color: '#000000',
    backgroundColor: '#b2d8d8',
    marginLeft: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 5,
  },
});

export default App;
