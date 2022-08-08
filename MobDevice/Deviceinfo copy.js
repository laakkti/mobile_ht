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

  const getIpAddress = async () => {
    const getValue = () =>
      new Promise((info, error) => DeviceInfo.getIpAddress(info, error));

    try {
      const val = await getVal();
      return val;
    } catch (error) {
      console.log('error =>', error);
      return 0;
    }
  };

  const getBatteryLevel = async () => {
    const getValue = () =>
      new Promise((info, error) => DeviceInfo.getBatteryLevel(info, error));

    try {
      const val = await getVal();
      return val;
    } catch (error) {
      console.log('error =>', error);
      return 0;
    }
  };

  const getUsedMemory = async () => {
    const getValue = () =>
      new Promise((info, error) => DeviceInfo.getUsedMemory(info, error));
    try {
      const val = await getVal();
      return val;
    } catch (error) {
      console.log('error =>', error);
      return 0;
    }
  };

  const getTotalMemory = async () => {
    const getValue = () =>
      new Promise((info, error) => DeviceInfo.getTotalMemory(info, error));
    try {
      const val = await getVal();
      return val;
    } catch (error) {
      console.log('error =>', error);
      return 0;
    }
  };

  const getIpAddress2 = () => {
    DeviceInfo.getIpAddress().then(ip => {
      setIpAddress(ip);
    });
  };

  const getBatteryLevel2 = () => {
    DeviceInfo.getBatteryLevel().then(val => {
      setBatteryLevel(val);
    });
  };

  const getUsedMemory2 = () => {
    DeviceInfo.getUsedMemory().then(val => {
      setUsedMemory(val);
    });
  };

  const getTotalMemory2 = () => {
    DeviceInfo.getTotalMemory().then(val => {
      setTotalMemory(val);
    });
  };

  // ehkei haeta ennekuin emaililla kysytään
  useEffect(() => {
    setBatteryLevel(getBatteryLevel());
    setUsedMemory(getUsedMemory());
    setTotalMemory(getTotalMemory());
    setIpAddress(getIpAddress());
  }, []);

  const handleClick = () => {
    console.log('####');
    //getBatteryLevel();
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
