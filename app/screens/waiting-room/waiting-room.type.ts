export interface IUserInRoom {
  userEmail: string;
  userAvatar: string;
  cameraStatus: CameraStatus;
}

export enum CameraStatus {
  On = 'On',
  Off = 'Off',
}
