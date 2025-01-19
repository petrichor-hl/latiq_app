import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BASE_URL } from '../configs/api.config';
import { zustandUser } from './user.zustand';

interface SignalRState {
  connection?: HubConnection;
  isConnected: boolean;
}

interface SignalRAction {
  initializeConnection: (token: string) => Promise<void>;
  stopConnection: () => void;
}

export const zustandSignalR = create<SignalRState & SignalRAction>()(
  immer((set, get) => ({
    connection: undefined,
    isConnected: false,
    initializeConnection: async accessToken => {
      let connection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/global-hub`, {
          accessTokenFactory: () => accessToken,
        })
        .configureLogging(LogLevel.None)
        .build();

      console.log(connection.baseUrl);

      set({ connection });

      try {
        await connection.start();
        set({ isConnected: true });
        console.log(
          `\x1b[43m\x1b[30m==> ${
            zustandUser.getState().user.email
          } has connected to the SignalR hub\x1b[0m`,
        );
      } catch (err) {
        console.error('Error while starting connection: ', err);
      }
    },
    stopConnection: async () => {
      const connection = get().connection;
      if (connection) {
        await connection.stop();
        set({ isConnected: false });
        console.log(
          `\x1b[43m\x1b[30m==> ${
            zustandUser.getState().user.email
          } has disconnected from the SignalR hub\x1b[0m`,
        );
      }
    },
  })),
);
