import React from 'react';
import {Alert, ToastAndroid, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useSDK} from '@metamask/sdk-react';
import {globalSteps} from '../running/RunningRoute';
import abi from './abi.json';
import {styles} from './ProfileRouteStyles';
import {ethers} from 'ethers';
import Config from 'react-native-config';

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

function ProfileRoute() {
  const {
    sdk,
    provider: ethereum,
    status,
    chainId,
    account,
    balance,
    connected,
  } = useSDK();

  const [RTEbalance, setRTEBalance] = React.useState<string | null>(null);

  const getBalance = async () => {
    try {
      const contractAddress = Config.CONTRACT_ADDRESS!;
      const rpcURL = Config.ALCHEMY_URL!;
      const web3Provider = new ethers.JsonRpcProvider(rpcURL);
      const contract = new ethers.Contract(contractAddress, abi, web3Provider);
      const result = await contract.balanceOf(account);
      // cast to number
      const numberBalance = Number(result);
      setRTEBalance(numberBalance / 10 ** 18 + ' RTE');
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      await sdk!.connect();
      await getBalance();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  const disconnectWallet = async () => {
    try {
      await sdk!.terminate();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const [tHx, setTHx] = React.useState<any>();
  const claimTokens = async () => {
    if (globalSteps === 0) {
      Alert.alert('No steps to claim', 'Please record your activity first');
    }
    try {
      var fromGweiSteps = globalSteps * 10 ** 18;
      Alert.alert('Claiming tokens', `Claiming ${globalSteps} RTE for ${globalSteps} steps`);
      var text = await fetch(
        `http://kreslo.abzy.kz:8000/api/run/mint?address=${account}&amount=${fromGweiSteps.toLocaleString('fullwide', {useGrouping:false})}`,
        {
          method: 'POST',
        },
      ).then(response => response.text());
      setTHx(text);
    } catch (error) {
      console.error('Failed to claim tokens:', error);
    }
  };
  const [userInfo, setUserInfo] = React.useState<any>();
  const getUserData = async () => {
    try {
      var text = await fetch(
        `http://kreslo.abzy.kz:8000/api/run/users?address=${account}`,
        {
          method: 'GET',
        },
      ).then(response => response.text());
      setUserInfo(text);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  return (
    <View style={styles.centerContainer}>
      <Text>
        Your Address: {account?.slice(0, 5)}...{account?.slice(-5, -1)}
      </Text>
      <Text>Your Balance: {RTEbalance}</Text>
      <Text>Status: {account != null ? 'Connected' : 'Not connected'} </Text>
      <Text>Chain: {getNetworkName(chainId)}</Text>
      {!connected && (
        <Button style={styles.button} mode="contained" onPress={connectWallet}>
          Connect Wallet
        </Button>
      )}
      {connected && (
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => getBalance()}>
          Refresh
        </Button>
      )}
      {connected && (
        <Button
          style={styles.button}
          mode="contained"
          onPress={disconnectWallet}>
          Disconnect
        </Button>
      )}
      {connected && (
        <Button style={styles.button} mode="contained" onPress={claimTokens}>
          Claim RTE for steps
        </Button>
      )}
      {connected && tHx && <Text>Claim transaction hash: {tHx}</Text>}
    </View>
  );
}

export default ProfileRoute;
