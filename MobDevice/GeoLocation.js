import React from 'react';
import Geolocation from '@react-native-community/geolocation';

const getLocation = async () => {
  const config = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 3600000,
  };

  const getCurrentPosition = () =>
    new Promise((info, error) =>
      Geolocation.getCurrentPosition(info, error, config),
    );

  try {
    const info = await getCurrentPosition();

    return {
      lat: info.coords.latitude.toString(),
      lon: info.coords.longitude.toString(),
    };
  } catch (error) {
    console.log('error =>', error);
    return {Message: Strings.Geolocation.Error(error.code)};
  }
};

export {getLocation};
