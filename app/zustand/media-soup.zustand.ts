import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { SFU_SERVER_URL } from '../configs/sfu-sever.config';
import { zustandUser } from './user.zustand';
import { Transport, Producer } from 'mediasoup-client/lib/types';

interface MediaSoupState {
  socket?: Socket;
  isConnected: boolean;
  producerTransport?: Transport;
  consumerTransport?: Transport;
  audioProducer?: Producer;
  videoProducer?: Producer;
}

interface MediaSoupAction {
  connect: () => void;
  disconnect: () => void;
  setProducerTransport: (producerTransport?: Transport) => void;
  setConsumerTransport: (consumerTransport?: Transport) => void;
  setAudioProducer: (audioProducer?: Producer) => void;
  setVideoProducer: (videoProducer?: Producer) => void;
}

export const zustandMediaSoup = create<MediaSoupState & MediaSoupAction>()(
  immer((set, get) => ({
    socket: undefined,
    isConnected: false,
    device: undefined,
    producerTransport: undefined,
    consumerTransport: undefined,
    audioProducer: undefined,
    videoProducer: undefined,
    connect: () => {
      const socket = io(SFU_SERVER_URL + '/mediasoup', { reconnection: false }); // Thay bằng URL server của bạn

      socket.on('connect', () => {
        set({ isConnected: true });
        console.log(
          `\x1b[44m\x1b[30m==> ${
            zustandUser.getState().user.email
          } has connected to the WebSocket hub\x1b[0m`,
        );
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
        console.log(
          `\x1b[44m\x1b[30m==> ${
            zustandUser.getState().user.email
          } has disconnected from the WebSocket hub\x1b[0m`,
        );
      });

      set({ socket });
    },
    disconnect: () => {
      get().socket?.disconnect();
      set({ socket: undefined });
    },
    setProducerTransport: producerTransport => {
      set(s => {
        s.producerTransport = producerTransport;
      });
    },
    setConsumerTransport: producerTransport => {
      set(s => {
        s.consumerTransport = producerTransport;
      });
    },
    setAudioProducer: audioProducer => {
      set(s => {
        s.audioProducer = audioProducer;
      });
    },
    setVideoProducer: videoProducer => {
      set(s => {
        s.videoProducer = videoProducer;
      });
    },
  })),
);
