import { useEffect, useState, useCallback } from 'react';
import { Event } from '../models/event';
import { eventApiService } from '../api/eventApiService';
import { validationStrings } from '../constants/validationStrings';

export const useEventViewModel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventApiService.getEvents();
      setEvents(data);
    } catch {
      setError(validationStrings.FAILED_TO_LOAD_EVENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = async (event: Omit<Event, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventApiService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
    } catch {
      setError(validationStrings.FAILED_TO_CREATE_EVENT);
      throw new Error(validationStrings.FAILED_TO_CREATE_EVENT);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, event: Omit<Event, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const existingEvent = events.find(e => e.id === id);

      const updatedEvent = {
        ...event,
        id,
        organizerId: existingEvent?.organizerId,
        createdAt: existingEvent?.createdAt,
        isDefault: existingEvent?.isDefault,
      };

      await eventApiService.updateEvent(updatedEvent);
      setEvents(prev =>
        prev.map(e => (e.id === id ? updatedEvent : e))
      );
    } catch {
      setError(validationStrings.FAILED_TO_UPDATE_EVENT_MESSAGE);
      throw new Error(validationStrings.FAILED_TO_UPDATE_EVENT_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await eventApiService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch {
      setError(validationStrings.FAILED_TO_DELETE_EVENT);
      throw new Error(validationStrings.FAILED_TO_DELETE_EVENT);
    } finally {
      setLoading(false);
    }
  };

  const getEventById = (id: string) => {
    return events.find(e => e.id === id);
  };

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  };
};