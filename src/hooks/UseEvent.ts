import { useEffect } from 'react';
import { Events } from '../event-system/Events';
import { EventSystem } from '../event-system/EventSystem';

export const useEvent = <T extends keyof Events>(event: T, listener: (event: Events[T]) => void) => {
  useEffect(() => {
    EventSystem.listen(event, listener);

    return () => {
      EventSystem.stopListening(event, listener);
    };
  }, [event, listener]);
};
