import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { BASE_URL } from '../configs/api.config';

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
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      set({ connection });

      try {
        await connection.start();
        set({ isConnected: true });
        console.log('Connected to the SignalR hub');
      } catch (err) {
        console.error('Error while starting connection: ', err);
      }
    },
    stopConnection: async () => {
      const connection = get().connection;
      if (connection) {
        await connection.stop();
        set({ isConnected: false });
        console.log('Disconnected from the SignalR hub');
      }
    },
  })),
);
