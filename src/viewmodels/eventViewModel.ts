import { useState } from 'react';
import { Event, PlayFormat } from '../models/event';
import { eventApiService } from '../api/eventApiService';

export const useEventViewModel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventApiService.getEvents();
      setEvents(data);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Event, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const createdEvent = await eventApiService.createEvent(event);
      setEvents(prev => [...prev, createdEvent]);
    } catch {
      setError('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (event: Event) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventApiService.updateEvent(event);
      setEvents(prev =>
        prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } catch {
      setError('Failed to update event');
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
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const registerTeam = async (eventId: string, format: PlayFormat) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventApiService.registerTeam(eventId, format);
      setEvents(prev =>
        prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to register team');
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerTeam,
  };
};
