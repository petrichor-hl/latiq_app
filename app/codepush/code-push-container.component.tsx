import React from 'react';
import { Component, PropsWithChildren } from 'react';
import CodePush, {
  CodePushOptions,
  DownloadProgress,
} from 'react-native-code-push';
import { UpdateProgress } from './update-progress.component';
import { consoleStyle } from '../configs/console-style.config';

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    title: 'Cập nhật phần mềm',
    mandatoryUpdateMessage: 'Vui lòng cập nhật phiên bản mới',
    mandatoryContinueButtonLabel: 'Cập nhật',
  },
};

export const CodePushContainer = CodePush(codePushOptions)(
  class extends Component<PropsWithChildren> {
    state = {
      progress: 0,
    };

    codePushStatusDidChange(status: CodePush.SyncStatus) {
      switch (status) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          printCodePushState('Checking for updates.');
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          printCodePushState('Downloading package.');
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          printCodePushState('Installing update.');
          break;
        case CodePush.SyncStatus.UP_TO_DATE:
          printCodePushState('Up-to-date.');
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          printCodePushState('Update installed.');
          break;
      }
    }

    codePushDownloadDidProgress(progress: DownloadProgress) {
      this.setState({
        progress: Math.round(
          (progress.receivedBytes / progress.totalBytes) * 100,
        ),
      });
    }

    render() {
      return (
        <React.Fragment>
          {this.props.children}
          {!!this.state.progress && (
            <UpdateProgress progress={this.state.progress} />
          )}
        </React.Fragment>
      );
    }
  },
);

const printCodePushState = (status: string) => {
  console.log(
    consoleStyle.bg.green,
    consoleStyle.fg.yellow,
    `CodePush State = ${status}`,
    consoleStyle.reset,
  );
};
