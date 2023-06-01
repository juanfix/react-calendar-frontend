import { useDispatch, useSelector } from 'react-redux';
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from '../store';
import calendarApi from '../api/calendarApi';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {
  const dispatch = useDispatch();

  const { activeEvent, events } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get('/events');
      const events = convertEventsToDateEvents(data.events);

      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log(error);
    }
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        // Actualizando
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user: user.name }));
        return;
      }

      // Creando
      const { data } = await calendarApi.post('/events', calendarEvent);

      dispatch(
        onAddNewEvent({
          ...calendarEvent,
          id: data.newEvent.id,
          user: user.name,
          uid: data.newEvent.user,
        })
      );
    } catch (error) {
      console.log(error);
      Swal.fire('Error saving the event.', error.response.data.msg, 'error');
    }
  };

  const startDeletingEvent = async (calendarEvent) => {
    try {
      if (activeEvent.id) {
        await calendarApi.delete(`/events/${activeEvent.id}`);
        dispatch(onDeleteEvent());
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error deleting the event.', error.response.data.msg, 'error');
    }
  };

  return {
    //* Properties
    activeEvent,
    events,
    hasEventSelected: !!activeEvent, // Falso si es null - true si corresponde a un objeto

    //* Methods
    setActiveEvent,
    startDeletingEvent,
    startLoadingEvents,
    startSavingEvent,
  };
};
