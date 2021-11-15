import {
  HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel,
} from '@microsoft/signalr';
import { HubEvents } from './event-system/Events';
import { EventSystem } from './event-system/EventSystem';
import { BASE_URL } from './services/BaseService';

export class SignalR {
    private static connection: HubConnection | undefined;

    public static Connected: Promise<void>;

    private static connectedResolve: (value: void | PromiseLike<void>) => void;

    public static accessToken: string = '';

    private static build() {
      SignalR.connection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/live`, { accessTokenFactory: () => SignalR.accessToken })
        .configureLogging(process.env.NODE_ENV === 'production' ? LogLevel.Information : LogLevel.Debug)
        .build();

      // eslint-disable-next-line no-restricted-syntax
      for (const evt of HubEvents) {
        SignalR.on(evt, (data) => EventSystem.fireEvent(evt, data));
      }

      SignalR.resetConnected();
    }

    private static resetConnected() {
      SignalR.Connected = new Promise((resolve) => {
        SignalR.connectedResolve = resolve;
      });

      SignalR.connection?.onclose(SignalR.resetConnected);
    }

    public static get state() {
      return SignalR.connection?.state;
    }

    public static get isConnected() {
      return SignalR.state === HubConnectionState.Connected;
    }

    public static start() {
      if (SignalR.connection === undefined) {
        SignalR.build();
      }

      SignalR.connection?.start().then(() => {
        SignalR.connectedResolve();
      });
    }

    public static stop() {
      SignalR.connection?.stop();
      SignalR.connection = undefined;
    }

    public static invoke(method: string, ...params: any[]) {
      return SignalR.Connected.then(() => SignalR.connection?.invoke(method, ...params));
    }

    public static on(event: string, cb: (event: any) => void) {
      return SignalR.connection?.on(event, cb);
    }

    public static off(event: string, cb: (event: any) => void) {
      return SignalR.connection?.off(event, cb);
    }
}
