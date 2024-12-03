import { render, screen } from '@testing-library/react';
import EventDetails from '../components/EventDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockEvent = {
  _id: '1',
  title: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  date: '2024-12-03T12:00:00Z',
  attendees: [{ username: 'User1', email: 'user1@example.com' }],
};

describe('EventDetails Component', () => {
  it('renders event details', () => {
    render(
      <MemoryRouter initialEntries={['/event/1']}>
        <Routes>
          <Route path='/event/:eventId' element={<EventDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
  });
});
