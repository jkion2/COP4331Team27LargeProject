import { render, screen } from '@testing-library/react';
import EventCard from '../components/EventCard';

const mockEvent = {
  _id: '1',
  image: 'https://example.com/image.png',
  title: 'Test Event',
  location: 'Test Location',
  date: '2024-12-03T12:00:00Z',
};

describe('EventCard Component', () => {
  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Location/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/3\/2024/i)).toBeInTheDocument();
  });
});
