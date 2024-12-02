import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

const DashboardCalendar = ({ events }) => {
  const navigate = useNavigate();

  // Function to determine if a date has an event
  const getTileClassName = ({ date }) => {
    const eventDates = events.map((event) =>
      new Date(event.date).toDateString()
    );
    return eventDates.includes(date.toDateString()) ? 'highlight' : '';
  };

  // Handle date click
  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    navigate(`/day-view/${formattedDate}`);
  };

  return (
    <div className='calendar-container'>
      <Calendar
        tileClassName={getTileClassName}
        onClickDay={handleDateClick} // Add click handler for day tiles
        className='custom-calendar'
      />
      <style>
        {`
          /* Container styling */
          .calendar-container {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 16px;
          }

          /* Modern calendar styling */
          .custom-calendar {
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            border: none;
            width: 100%;
          }

          /* Month header styling */
          .custom-calendar .react-calendar__navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .custom-calendar .react-calendar__navigation button {
            color: #98383B;
            background: none;
            border: none;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
          }

          /* Weekday labels styling */
          .custom-calendar .react-calendar__month-view__weekdays {
            font-size: 0.9rem;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 8px;
          }

          /* Day tiles styling */
          .custom-calendar .react-calendar__tile {
            font-size: 1rem;
            color: #444;
            padding: 12px;
            border-radius: 12px;
            transition: all 0.2s ease;

            border: 1px solid transparent;
          }

          .custom-calendar .react-calendar__tile:enabled:hover {
            background: #F5E6E6;
            border: 1px solid #98383B;
          }

          .custom-calendar .react-calendar__tile--now {
            background: #98383B;
            color: white;
            font-weight: bold;
            border-radius: 12px;
          }

          .custom-calendar .react-calendar__tile--active {
            background: none;
            color: #444;
            border-radius: 12px;
          }

          /* Highlighted event dates */
          .highlight {
            background-color: #E9BDB8;
            color: black;
            font-weight: bold;
            border-radius: 12px;
          }

          .highlight:hover {
            background-color: #C68987;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardCalendar;
