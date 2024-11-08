
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import Navigation from './src/core/Navigation';
import TopBar from './src/core/TopBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import Config from 'react-native-config';

import {
  MetaMaskProvider,
  SDKConfigProvider,
  useSDKConfig,
} from '@metamask/sdk-react';

import {Linking, LogBox} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
  'Message ignored because invalid key exchange status',
  "MetaMask: 'ethereum._metamask' exposes",
  '`new NativeEventEmitter()` was called with a non-null',
]); // Ignore log notification by message

// TODO how to properly make sure we only try to open link when the app is active?
// current problem is that sdk declaration is outside of the react scope so I cannot directly verify the state
// hence usage of a global variable.
let canOpenLink = true;

const WithSDKConfig = ({children}: {children: React.ReactNode}) => {
  const {
    socketServer,
    infuraAPIKey,
    useDeeplink,
    debug,
    checkInstallationImmediately,
  } = useSDKConfig();

  return (
    <MetaMaskProvider
      debug={debug}
      sdkOptions={{
        communicationServerUrl: socketServer,
        infuraAPIKey,
        readonlyRPCMap: {
          '0x539': Config.NEXT_PUBLIC_PROVIDER_RPCURL ?? '',
        },
        logging: {
          developerMode: true,
          plaintext: true,
        },
        openDeeplink: (link: string, _target?: string) => {
          console.debug(`App::openDeepLink() ${link}`);
          if (canOpenLink) {
            Linking.openURL(link);
          } else {
            console.debug(
              'useBlockchainProiver::openDeepLink app is not active - skip link',
              link,
            );
          }
        },
        timer: BackgroundTimer,
        useDeeplink,
        checkInstallationImmediately,
        storage: {
          enabled: true,
          // storageManager: new StoraManagerAS(),
        },
        dappMetadata: {
          name: 'RunToEarn',
          url: 'https://abzy.kz',
          iconUrl: 'https://www.google.com/favicon.ico',
        },
        i18nOptions: {
          enabled: true,
        },
      }}>
      {children}
    </MetaMaskProvider>
  );
};

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };

Icon.loadFont();


export const SafeApp = () => {
  return (
    <SDKConfigProvider
      initialSocketServer={process.env.COMM_SERVER_URL}
      initialInfuraKey={process.env.INFURA_API_KEY}>
      <WithSDKConfig>
        <PaperProvider theme={theme}>
          <TopBar theme={theme} />
          <Navigation theme={theme} />
        </PaperProvider>
      </WithSDKConfig>
    </SDKConfigProvider>
  );
};
