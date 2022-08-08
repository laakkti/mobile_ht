import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import {Button} from 'react-native-elements';
import {StyleSheet, Text, View} from 'react-native';

//export default function Deviceinfo() {
const Deviceinfo = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [ipAddress, setIpAddress] = useState(0);

  const getIpAddress = () => {
    DeviceInfo.getIpAddress().then(ip => {
      setIpAddress(ip);
    });
  };

  const getBatteryLevel = () => {
    DeviceInfo.getBatteryLevel().then(val => {
      setBatteryLevel(val);
    });
  };

  const getUsedMemory = () => {
    DeviceInfo.getUsedMemory().then(val => {
      setUsedMemory(val);
    });
  };

  const getTotalMemory = () => {
    DeviceInfo.getTotalMemory().then(val => {
      setTotalMemory(val);
    });
  };

  // ehkei haeta ennekuin emaililla kysytään
  useEffect(() => {
    getBatteryLevel();
    getUsedMemory();
    getTotalMemory();
    getIpAddress();
  }, []);

  const handleClick = () => {
    console.log('####');
    getBatteryLevel();
  };

  return (
    <View style={styles.main}>
      <Text>{batteryLevel}</Text>
      <Text>
        {usedMemory}/{totalMemory}
      </Text>
      <Text>{ipAddress}</Text>
      <Button title="batterylevel" onPress={handleClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {flex: 0, justifyContent: 'center', alignItems: 'center'},
});

export default Deviceinfo;
