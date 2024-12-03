'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner'; // Import Sonner
import { Button } from './ui/button';
import EventCard from './EventCard';
import DashboardCalendar from './DashCal';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');
  const [activeTab, setActiveTab] = useState('yourEvents');
  const [previewImage, setPreviewImage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inviteEmails, setInviteEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [events, setEvents] = useState({
    yourEvents: [],
    upcomingEvents: [],
    pastEvents: [],
  });

  // Add email to the invite list
  const handleAddEmail = () => {
    if (currentEmail && !inviteEmails.includes(currentEmail)) {
      setInviteEmails([...inviteEmails, currentEmail]);
      setCurrentEmail('');
    }
  };

  // Remove email from the invite list
  const handleRemoveEmail = (email) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  };

  const fetchEvents = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/events?userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const allEvents = await response.json();

      const now = new Date();
      const categorizedEvents = {
        yourEvents: allEvents.filter((event) => event.organizerId === user.id),
        upcomingEvents: allEvents.filter(
          (event) =>
            new Date(event.date) >= now &&
            (event.sharedWith?.includes(user.id) ||
              event.organizerId === user.id)
        ),
        pastEvents: allEvents.filter(
          (event) =>
            new Date(event.date) < now &&
            (event.sharedWith?.includes(user.id) ||
              event.organizerId === user.id)
        ),
      };

      setEvents(categorizedEvents);
      toast.success('Events refreshed successfully!', {
        style: {
          color: '#065f46', // Dark green text
          border: '1px solid #10b981', // Green border
        },
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events.', {
        style: {
          color: '#b91c1c', // Dark red text
          border: '1px solid #f87171', // Red border
        },
      });
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [user.id]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      image: null,
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await toBase64(file);
      form.setValue('image', base64Image);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCreateEvent = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          organizerId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();

      toast.success(`Event "${data.title}" has been created!`, {
        description: `Scheduled for ${new Date(data.date).toLocaleString()}.`,

        style: {
          color: '#065f46', // Dark green text
          border: '1px solid #10b981', // Green border
        },
      });

      // Send invites if emails are provided
      if (inviteEmails.length > 0) {
        await sendInvites(result.eventId, inviteEmails);
      }

      form.reset();
      setPreviewImage(null);
      setInviteEmails([]);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event', {
        description: 'Please try again.',
        style: {
          color: '#b91c1c', // Dark red text
          border: '1px solid #f87171', // Red border
        },
      });
    }
  };

  const sendInvites = async (eventId, emails) => {
    for (const email of emails) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/events/${eventId}/invite`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientEmail: email }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to send invite to ${email}`);
        }

        toast.success(`Invite successfully sent to ${email}`, {
          description: 'The user has been notified.',

          style: {
            color: '#065f46', // Dark green text
            border: '1px solid #10b981', // Green border
          },
        });
      } catch (error) {
        console.error(`Error sending invite to ${email}:`, error);
        toast.error(`Error sending invite to ${email}`, {
          description: 'Please try again later.',
          style: {
            color: '#b91c1c', // Dark red text
            border: '1px solid #f87171', // Red border
          },
        });
      }
    }
  };

  const renderContent = () => {
    const tabEvents = events[activeTab] || [];
    return (
      <ScrollArea className='h-[40rem] w-full'>
        {' '}
        {/* Adjust height and width as needed */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {tabEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </ScrollArea>
    );
  };

  const getTileClassName = ({ date }) => {
    const eventDates = events.upcomingEvents.map((event) =>
      new Date(event.date).toDateString()
    );
    return eventDates.includes(date.toDateString()) ? 'highlight' : '';
  };

  return (
    <div className='flex flex-row h-screen bg-gray-100 p-12 gap-12'>
      <Toaster />
      {/* Left Section: Tabs and Events */}
      <div className='w-2/3 flex flex-col'>
        {/* Event Dashboard Header */}
        <h2 className='text-6xl self-center font-semibold mb-8 text-[#3C1517]'>
          Events Dashboard
        </h2>

        <div className='relative'>
          {/* Refresh Button */}
          <Button
            onClick={fetchEvents}
            className='absolute top-0 left-0 translate-x-5 bg-[#4d1a1c] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md hover:bg-[#672325]'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className={`w-10 h-10 transition-transform ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <path
                fillRule='evenodd'
                d='M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z'
                clipRule='evenodd'
              />
            </svg>
          </Button>

          {/* Tabs */}
          <div className='flex justify-center gap-8 mb-6 '>
            {['yourEvents', 'upcomingEvents', 'pastEvents'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-black text-2xl font-normal bg-transparent rounded-none pt-2 px-1 ${
                  activeTab === tab ? 'border-b-4 border-[#98383B]' : ''
                }`}
                size='lg'
                variant='link'
              >
                {tab === 'yourEvents'
                  ? 'Your Events'
                  : tab === 'upcomingEvents'
                  ? 'Upcoming Events'
                  : 'Past Events'}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='p-2 bg-transparent rounded w-full'>
          {renderContent()}
        </div>
      </div>

      {/* Right Section: Calendar */}
      <div className=' flex flex-col gap-6 mt-28 items-center w-1/3'>
        <DashboardCalendar events={events.upcomingEvents} />
        {/* New Event Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className='flex flex-row w-52 gap-6 bg-[#4d1a1c] text-white py-2 px-12 font-normal rounded-2xl shadow-md h-14 text-2xl hover:bg-[#672325]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                style={{ width: '30px', height: '36px' }}
              >
                <path
                  fillRule='evenodd'
                  d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
                  clipRule='evenodd'
                />
              </svg>
              <div>New Event</div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-3xl font-semibold text-[#4d1a1c]'>
                Let's Make Some Plans!
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateEvent)}
                className='space-y-4'
              >
                {/* Image Picker */}
                <div className='flex flex-col items-start'>
                  <label
                    htmlFor='image-upload'
                    className='mb-2 text-lg font-medium'
                  >
                    Event Image
                  </label>
                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='file:border file:text-black file:border-gray-300 file:bg-gray-300 file:px-4 file:rounded file:cursor-pointer'
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt='Event Preview'
                      className='mt-4 rounded-md w-full max-h-56 object-cover'
                    />
                  )}
                </div>
                {/* Title */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl'>Event Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter title'
                          className='bg-gray-300'
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xl'>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder='Enter description'
                          className='bg-gray-300 p-2 rounded-md w-full resize-none h-16 placeholder-muted-foreground'
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-row gap-6'>
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xl'>Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='datetime-local'
                            className='bg-gray-300'
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xl'>Location</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Enter location'
                            className='bg-gray-300'
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Invite Users Section */}
                <div className='space-y-4'>
                  <label
                    htmlFor='invite-emails'
                    className='text-xl font-semibold'
                  >
                    Invite Users
                  </label>
                  <div className='flex items-center space-x-2'>
                    <input
                      id='invite-emails'
                      type='email'
                      placeholder="Enter user's email"
                      className='w-full bg-gray-300 p-2 rounded-md'
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                    />
                    <Button
                      type='button'
                      className='bg-[#4d1a1c] text-white'
                      onClick={handleAddEmail}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className='space-y-2'>
                    {inviteEmails.map((email) => (
                      <li
                        key={email}
                        className='flex justify-between items-center'
                      >
                        <span>{email}</span>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveEmail(email)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Submit Button */}
                <Button
                  type='submit'
                  className='bg-[#4d1a1c] text-xl py-5 w-full text-white'
                >
                  Create Event
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default Dashboard;
