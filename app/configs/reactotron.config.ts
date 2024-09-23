import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name: 'LaTiQ App',
})
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: _stackFrame => false }, // or turn it off with false
    overlay: false, // just turning off overlay
    log: true,
  })
  .connect();

Reactotron.onCustomCommand({
  title: 'Show Dev Menu',
  description: 'Opens the React Native dev menu',
  command: 'showDevMenu',
  handler: () => {
    NativeModules.DevMenu.show();
  },
});
