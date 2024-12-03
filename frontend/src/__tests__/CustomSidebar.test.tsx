import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomSidebar from '../components/CustomSidebar';

describe('CustomSidebar Component', () => {
  it('renders the sidebar links', () => {
    render(
      <BrowserRouter>
        <CustomSidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });
});
