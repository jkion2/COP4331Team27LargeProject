import React, { useEffect, useState, useMemo } from 'react';
import { ScrollArea } from './ui/scroll-area';
import EventCard from './EventCard';

const DayView = ({ date }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use useMemo to prevent unnecessary re-creation of the user object
  const user = useMemo(
    () => JSON.parse(localStorage.getItem('user_data') || '{}'),
    []
  );

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !user.id || !date) {
        console.error('Invalid user or date');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/events?userId=${user.id}&dateFilter=${date}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [date, user.id]); // Only run when `date` or `user.id` changes

  if (loading) return <p>Loading timeline...</p>;

  // Helper to calculate vertical position
  const calculatePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours + minutes / 60) * 60; // 50px per hour
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <header className='mb-4 text-center'>
        <h1 className='text-3xl font-bold text-[#3C1517]'>Day View</h1>
        <p className='text-lg text-gray-600'>
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </header>
      <ScrollArea className='h-[calc(100vh-100px)] border border-gray-300 rounded-lg bg-white'>
        <div className='relative h-full'>
          {/* Timeline */}
          <div className='absolute top-0 left-8 w-1 bg-[#3C1517] h-full' />

          {/* Hours */}
          {[...Array(24)].map((_, hour) => (
            <div
              key={hour}
              className='relative flex items-center'
              style={{ top: `${hour * 60}px` }} // Position each hour
            >
              <div className='absolute left-0 text-gray-500 text-sm -translate-y-1/2'>
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? '12 PM'
                  : `${hour - 12} PM`}
              </div>
            </div>
          ))}

          {/* Events */}
          {events.map((event) => {
            const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            const topPosition = calculatePosition(eventTime);

            return (
              <div
                key={event._id}
                className='absolute'
                style={{
                  top: `${topPosition}px`,
                  left: '10%', // Fixed position for all cards
                  width: '70%', // Smaller width
                }}
              >
                <div className='p-2 bg-white border rounded-md shadow-md'>
                  <EventCard event={event} variant='small' />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DayView;
