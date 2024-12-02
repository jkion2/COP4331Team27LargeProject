import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { _id, image, title, location, date } = event;

  const handleClick = () => {
    // Retrieve and update recent events in localStorage
    const recentEvents = JSON.parse(
      localStorage.getItem('recent_events') || '[]'
    );
    const updatedRecents = [
      { _id, title }, // Add the new event
      ...recentEvents.filter((e) => e._id !== _id), // Remove duplicates
    ].slice(0, 5); // Keep only the latest 5

    localStorage.setItem('recent_events', JSON.stringify(updatedRecents));
    navigate(`/event/${_id}`); // Navigate to the event details page
  };

  return (
    <Card
      className='w-full max-w-sm border bg-[#f9e9e6] border-[#3C1517] shadow-md rounded-lg cursor-pointer'
      onClick={handleClick}
    >
      <CardHeader className='p-0'>
        {image && (
          <img
            src={image}
            alt={title}
            className='w-full h-48 object-cover rounded-t-lg'
          />
        )}
      </CardHeader>
      <CardContent className='p-3 rounded-b-lg'>
        <CardTitle className='text-2xl font-semibold'>{title}</CardTitle>
        <CardDescription className='text-lg text-gray-600'>
          Location: {location}
        </CardDescription>
        <CardDescription className='text-lg text-gray-600'>
          Date: {new Date(date).toLocaleString()}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default EventCard;
