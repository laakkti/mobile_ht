import React from 'react';
import DeviceInfo from 'react-native-device-info';

const getIpAddress = async () => {
  const getValue = () => new Promise(() => DeviceInfo.getIpAddress());
  //new Promise((info, error) => DeviceInfo.getIpAddress(info, error));

  try {
    const val = await getValue();
    return val;
  } catch (error) {
    console.log('error =>', error);
    return 0;
  }
};

const getBatteryLevel = async () => {
  return await DeviceInfo.getBatteryLevel();
};

const getBatteryLevelxx = async () => {
  const getValue = () =>
    new Promise(() =>
      DeviceInfo.getBatteryLevel().then(val => {
        //setBatteryLevel(val);
        console.log('val =>', val);
        //return val;
      }),
    );

  let val = 111;
  try {
    console.log('getBatteryLevel in deviceinfo');
    val = await getValue();
    console.log('val=' + val);
    //console.log("xxxxxxxxx "+DeviceInfo.getBatteryLevel());
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
    const val = await getValue();
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
    const val = await getValue();
    return val;
  } catch (error) {
    console.log('error =>', error);
    return 0;
  }
};

export {getIpAddress, getBatteryLevel, getUsedMemory, getTotalMemory};
