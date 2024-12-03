import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';

const EventCard = ({ event, variant = 'default' }) => {
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
    ].slice(0, 10); // Keep only the latest

    localStorage.setItem('recent_events', JSON.stringify(updatedRecents));
    navigate(`/event/${_id}`); // Navigate to the event details page
  };

  // Classes for different variants
  const variants = {
    default: {
      card: 'w-full max-w-sm border bg-[#f9e9e6] border-[#3C1517] shadow-md rounded-lg cursor-pointer',
      image: 'w-full h-48 object-cover rounded-t-lg',
      title: 'text-2xl font-semibold',
      description: 'text-lg text-gray-600',
    },
    small: {
      card: 'w-full max-w-xs border bg-[#f9e9e6] border-[#3C1517] shadow-sm rounded-md cursor-pointer',
      image: 'w-full h-32 object-cover rounded-t-md',
      title: 'text-xl font-semibold',
      description: 'text-sm text-gray-600',
    },
  };

  const styles = variants[variant] || variants.default;

  return (
    <Card className={styles.card} onClick={handleClick}>
      <CardHeader className='p-0'>
        {image && <img src={image} alt={title} className={styles.image} />}
      </CardHeader>
      <CardContent className='p-3 rounded-b-lg'>
        <CardTitle className={styles.title}>{title}</CardTitle>
        <CardDescription className={styles.description}>
          Location: {location}
        </CardDescription>
        <CardDescription className={styles.description}>
          Date: {new Date(date).toLocaleString()}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default EventCard;
