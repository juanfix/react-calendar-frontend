import { parseISO } from 'date-fns';

/**
 * The function converts events in an array to date events by parsing their start and end dates using
 * the parseISO function.
 * @param [events] - The `events` parameter is an array of objects representing events. Each event
 * object has properties such as `start` and `end` that represent the start and end times of the event.
 * The function `convertEventsToDateEvents` takes this array as input and returns a new array with the
 * `start
 * @returns The `convertEventsToDateEvents` function is returning an array of events where the `start`
 * and `end` properties of each event object have been converted to JavaScript `Date` objects using the
 * `parseISO` function from the `date-fns` library.
 */

export const convertEventsToDateEvents = (events = []) => {
  return events.map((event) => {
    event.start = parseISO(event.start);
    event.end = parseISO(event.end);
    event.uid = event.user._id;
    event.user = event.user.name;

    return event;
  });
};
