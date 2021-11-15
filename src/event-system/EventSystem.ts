import { Events } from './Events';

export class EventSystem {
    private static eventQueues: Record<string, ((event: any) => void)[]> = {};

    public static listen<T extends keyof Events>(event: T, listener: (event: Events[T]) => void): void {
      if (this.eventQueues[event] === undefined) {
        this.eventQueues[event] = [];
      }

      this.eventQueues[event].push(listener);
    }

    public static stopListening<T extends keyof Events>(event: T, listener: (event: Events[T]) => void): void {
      if (this.eventQueues[event] === undefined) {
        return;
      }

      this.eventQueues[event] = this.eventQueues[event].filter((x) => x !== listener);
    }

    public static fireEvent<T extends keyof Events>(event: T, data: Events[T]): void {
      if (this.eventQueues[event] === undefined) {
        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const listener of this.eventQueues[event]) {
        listener(data);
      }
    }
}
