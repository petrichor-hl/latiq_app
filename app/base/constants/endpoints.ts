export const Endpoints = {
  Test: {
    ANONYMOUS: '/Test/anonymous',
    AUTHENTICATED: '/Test/authenticated',
    TIMEOUT: '/Test/timeout',
    SERVER_ERROR: '/Test/server-error',
  },
  Account: {
    REGISTER: '/Account/register',
    LOGIN: '/Account/login',
    REFRESH_TOKEN: '/Account/refresh-token',
    LOGOUT: '/Account/logout',
  },
  User: {
    GET_PROFILE: '/User/get-profile',
    UPDATE_PROFILE: '/User/update-profile',
  },
  Room: {
    MAKE_ROOM: '/Room/make-room',
    GET_ROOM: '/Room/{roomCode}',
  },
  Topic: {
    GET_LIST_TOPIC: '/Topic',
  },
};
