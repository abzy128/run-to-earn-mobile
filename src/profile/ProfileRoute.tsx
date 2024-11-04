import React from 'react';
import {ToastAndroid, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useSDK} from '@metamask/sdk-react';
// import {Web3} from 'web3';

function getNetworkName(chainId: string | undefined) {
  switch (chainId) {
    case '0x1':
      return 'Mainnet';
    case '0xAA36A7':
      return 'Sepolia';
    case '0x4268':
      return 'Holesky';
    default:
      return 'Unknown';
  }
}

import abi from './abi.json';

const web3 = new Web3();
const contractAddress = process.env.CONTRACT_ADDRESS;

function ProfileRoute() {
  const {
    sdk,
    provider: ethereum,
    status,
    chainId,
    account,
    balance,
    readOnlyCalls,
    connected,
  } = useSDK();

  const [registrationStatus, setRegistrationStatus] = React.useState('');

  const connectWallet = async () => {
    try {
      await sdk!.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  const disconnectWallet = async () => {
    try {
      await sdk!.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const registration = async () => {
    try {
      const registerFunctionABI = {
        inputs: [],
        name: 'register',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      };
      const data = web3.eth.abi.encodeFunctionCall(registerFunctionABI, []);
      await ethereum!.request({method: 'eth_requestAccounts'});
      const from = ethereum!.selectedAddress;
      const txHash = await ethereum!.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: contractAddress,
            data,
            value: '0x0',
          },
        ],
      });
      ToastAndroid.show(`Transaction sent: ${txHash}`, ToastAndroid.SHORT);
      console.log(`Transaction sent: ${txHash}`);
    } catch (error) {
      ToastAndroid.show(
        `Failed to register in RunToEarn: ${error}`,
        ToastAndroid.LONG,
      );
      console.error('Failed to register in RunToEarn:', error);
    }
  };

  return (
    <View>
      {!connected && <Button onPress={connectWallet}>Connect Wallet</Button>}
      {connected && <Button onPress={disconnectWallet}>Disconnect</Button>}
      <Text>Your Account: {account}</Text>
      <Text>Your Balance: {balance}</Text>
      <Text>Status: {status?.connectionStatus} </Text>
      <Text>Chain: {getNetworkName(chainId)}</Text>
      {connected && <Button onPress={registration}>Register in RunToEarn</Button>}
    </View>
  );
}

export default ProfileRoute;
