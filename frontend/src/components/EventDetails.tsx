import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import { toast, Toaster } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<{
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    image?: string;
    attendees?: { email: string }[];
    organizer?: { _id: string; username?: string };
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<{
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    image?: string;
    attendees?: { email: string }[];
  }>({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    attendees: [],
  });
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `https://event-ify.xyz/api/events?eventId=${eventId}`
        );
        if (!response.ok) throw new Error('Failed to fetch event details');

        const data = await response.json();
        setEvent(data);
        setEditedEvent({ ...data, attendees: data.attendees || [] }); // Ensure attendees is an array
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const user = JSON.parse(localStorage.getItem('user_data') || '{}');

  const handleAddAttendee = async (email: string) => {
    try {
      const response = await fetch(
        `https://event-ify.xyz/api/events/${eventId}/invite`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientEmail: email }),
        }
      );

      if (!response.ok) throw new Error(`Failed to invite ${email}`);

      toast.success(`Invite sent to ${email}`, {
        style: { color: '#065f46', border: '1px solid #10b981' },
      });

      // Update attendees in the edited event
      setEditedEvent((prev) => ({
        ...prev,
        attendees: [...(prev.attendees || []), { email }],
      }));
    } catch (error) {
      console.error('Error inviting attendee:', error);
      toast.error(`Failed to invite ${email}. Please try again.`, {
        style: { color: '#b91c1c', border: '1px solid #f87171' },
      });
    }
  };

  const handleEdit = async () => {
    try {
      // Update the event
      const updateResponse = await fetch(
        `https://event-ify.xyz/api/events/${eventId}/edit`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editedEvent.title,
            description: editedEvent.description,
            date: editedEvent.date,
            location: editedEvent.location,
            image: editedEvent.image,
            attendees: editedEvent.attendees, // Include updated attendees
          }),
        }
      );

      if (!updateResponse.ok) throw new Error('Failed to edit event');

      // Notify attendees about the update
      const notifyResponse = await fetch(
        `https://event-ify.xyz/api/events/${eventId}/notify-update`,
        {
          method: 'POST',
        }
      );

      if (!notifyResponse.ok) throw new Error('Failed to notify attendees');

      toast.success(`Event updated and attendees notified!`, {
        style: { color: '#065f46', border: '1px solid #10b981' },
      });

      setIsEditing(false);
      setEvent(editedEvent); // Update displayed event data
    } catch (error) {
      console.error('Error editing event:', error);
      toast.error(`Failed to update event. Please try again.`, {
        style: { color: '#b91c1c', border: '1px solid #f87171' },
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://event-ify.xyz/api/events/${eventId}/delete`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete event');

      toast.success(`Event deleted successfully!`, {
        style: { color: '#065f46', border: '1px solid #10b981' },
      });
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(`Failed to delete event. Please try again.`, {
        style: { color: '#b91c1c', border: '1px solid #f87171' },
      });
    }
  };

  if (!event) return <p>Loading event details...</p>;

  const { image, title, description, location, date, organizer, attendees } =
    event;

  const isOwner = user?.id === organizer?._id;

  return (
    <div className='p-6 bg-gray-100 flex flex-col items-center'>
      <Toaster />
      {/* Event Image */}
      {isEditing ? (
        <div className='flex flex-col mb-4'>
          <label className='text-black font-bold mb-2'>Image:</label>
          <input
            type='file'
            accept='image/*'
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const base64Image = await toBase64(file);

                // Ensure `base64Image` is a string or undefined (filter out `null` and `ArrayBuffer`)
                if (typeof base64Image === 'string') {
                  setEditedEvent((prev) => ({ ...prev, image: base64Image }));
                }
              }
            }}
          />
          {editedEvent.image && (
            <img
              src={editedEvent.image}
              alt='Preview'
              className='mt-4 rounded-md w-full max-h-56 object-cover'
            />
          )}
        </div>
      ) : image ? (
        <img
          src={image}
          alt={title}
          className='w-full max-w-4xl h-64 object-cover rounded-lg mb-6 shadow-lg'
        />
      ) : (
        <div className='w-full max-w-4xl h-64 bg-gray-300 flex items-center justify-center rounded-lg mb-6 shadow-lg'>
          <p className='text-gray-500'>No image available</p>
        </div>
      )}

      {/* Event Title and Organizer */}
      <div className='w-full max-w-4xl text-center mb-6'>
        {isEditing ? (
          <div className='flex flex-col items-start mb-4'>
            <label className='text-black font-bold mb-2'>Title:</label>
            <Input
              value={editedEvent.title}
              onChange={(e) =>
                setEditedEvent((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
        ) : (
          <h1 className='text-4xl font-bold text-[#3C1517]'>{title}</h1>
        )}
        <p className='text-lg text-gray-600'>
          Organized by <strong>{organizer?.username || 'Unknown'}</strong>
        </p>
      </div>

      {/* Event Details */}
      <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-6'>
        <h2 className='text-2xl font-semibold text-[#3C1517] mb-4'>
          Event Details
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            {isEditing ? (
              <>
                <label className='text-black font-bold mb-2'>Date:</label>
                <Input
                  type='datetime-local'
                  value={editedEvent.date}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, date: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <p className='text-lg'>
                  <strong>Date:</strong>{' '}
                  {date ? new Date(date).toLocaleDateString() : 'Not specified'}
                </p>
                <p className='text-lg'>
                  <strong>Time:</strong>{' '}
                  {date ? new Date(date).toLocaleTimeString() : 'Not specified'}
                </p>
              </>
            )}
          </div>
          <div>
            {isEditing ? (
              <>
                <label className='text-black font-bold mb-2'>Location:</label>
                <Input
                  value={editedEvent.location}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, location: e.target.value })
                  }
                />
              </>
            ) : (
              <p className='text-lg'>
                <strong>Location:</strong> {location || 'Not specified'}
              </p>
            )}
          </div>
        </div>
        <div className='mt-4'>
          {isEditing ? (
            <>
              <label className='text-black font-bold mb-2'>Description:</label>
              <textarea
                value={editedEvent.description}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    description: e.target.value,
                  })
                }
                className='w-full h-24 bg-gray-200 rounded-md p-2'
              />
            </>
          ) : (
            <p className='text-lg'>
              <strong>Description:</strong>{' '}
              {description || 'No description provided'}
            </p>
          )}
        </div>
      </div>
      {/* Attendees Management */}
      <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mt-6'>
        <h2 className='text-2xl font-semibold text-[#3C1517] mb-4'>
          Attendees
        </h2>
        {isEditing ? (
          <>
            <div className='space-y-4'>
              <label htmlFor='invite-emails' className='text-xl font-semibold'>
                Manage Attendees
              </label>
              <div className='flex items-center space-x-2'>
                <input
                  id='invite-emails'
                  type='email'
                  placeholder="Enter user's email"
                  className='w-full bg-gray-200 p-2 rounded-md'
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                />
                <Button
                  type='button'
                  className='bg-[#4d1a1c] text-white'
                  onClick={() => {
                    if (
                      currentEmail &&
                      !editedEvent.attendees.find(
                        (attendee) => attendee.email === currentEmail
                      )
                    ) {
                      handleAddAttendee(currentEmail);
                      setCurrentEmail('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <ul className='space-y-2'>
                {editedEvent.attendees?.map((attendee) => (
                  <li
                    key={attendee.email}
                    className='flex justify-between items-center text-lg'
                  >
                    <span>{attendee.email}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        setEditedEvent((prev) => ({
                          ...prev,
                          attendees:
                            prev.attendees?.filter(
                              (a) => a.email !== attendee.email
                            ) || [], // Ensure attendees is not undefined
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : attendees?.length > 0 ? (
          <ul className='list-disc pl-5 text-lg text-gray-600'>
            {attendees.map((attendee) => (
              <li key={attendee.email}>
                {attendee.username} ({attendee.email})
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-600'>No attendees yet.</p>
        )}
      </div>
      <ScrollArea />

      {/* Edit/Delete Buttons */}
      {isOwner && (
        <div className='absolute top-6 right-6 flex gap-4'>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className='hover:bg-muted-foreground bg-accent-foreground text-white'
            >
              Edit
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={handleEdit}
                className='bg-green-900 hover:bg-green-700 text-white'
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className='bg-red-500 text-white'
              >
                Discard Changes
              </Button>
            </div>
          )}
          {/* Alert Dialog for Delete Confirmation */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='bg-red-500 hover:bg-red-600 text-white flex items-center gap-2'>
                Delete
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete the event "{title}"? This
                  action cannot be undone.
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className='bg-red-600'
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

function toBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default EventDetails;
