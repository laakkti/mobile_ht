import React from 'react';
import DeviceInfo from 'react-native-device-info';

const getIpAddress = async () => {
  return await DeviceInfo.getIpAddress();
};

const getBatteryLevel = async () => {
  return await DeviceInfo.getBatteryLevel();
};

const getUsedMemory = async () => {
  return await DeviceInfo.getUsedMemory();
};

const getTotalMemory = async () => {
  return await DeviceInfo.getTotalMemory();
};

export {getIpAddress, getBatteryLevel, getUsedMemory, getTotalMemory};
