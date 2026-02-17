import React, { createContext, useContext } from 'react';
import { useEventViewModel } from '../viewmodels/eventViewModel';
import { validationStrings, headerStrings } from '../constants/validationStrings';

type EventContextType = ReturnType<typeof useEventViewModel>;

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewModel = useEventViewModel();

  return (
    <EventContext.Provider value={viewModel}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error(validationStrings.AUTH_ERROR);
  return context;
};