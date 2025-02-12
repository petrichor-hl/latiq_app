import { ProducerOptions } from 'mediasoup-client/lib/Producer';

// export const SFU_SERVER_URL = 'http://172.20.10.3:3000';
// export const SFU_SERVER_URL = 'http://192.168.22.88:3000';
export const SFU_SERVER_URL = 'http://192.168.1.9:3000';

// WebRTC Simulcast: https://www.wowza.com/blog/webrtc-simulcast-what-it-is-and-how-it-works
// WebRtc-SCV: https://w3c.github.io/webrtc-svc/
export const VIDEO_PARAMS: ProducerOptions = {
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};
