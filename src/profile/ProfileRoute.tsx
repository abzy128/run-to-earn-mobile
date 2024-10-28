import React from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useSDK} from '@metamask/sdk-react';

function ProfileRoute() {
  const {connect, disconnect, account, chainId, ethereum} = useSDK();

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  return (
    <View>
      <Button onPress={connectWallet}>Connect Wallet</Button>
      <Text>Account: {account}</Text>
      <Text>Chain ID: {chainId}</Text>
      <Text>Ethereum: {ethereum}</Text>
      <Text>Profile</Text>
    </View>
  );
}

export default ProfileRoute;
