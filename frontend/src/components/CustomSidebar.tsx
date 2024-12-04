import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from './ui/sidebar'; // Ensure this path matches your project

import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function CustomSidebar() {
  const navigate = useNavigate();

  const [recentEvents, setRecentEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Tracks collapsible state

  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem('user_data') || '{}'),
    []
  );
  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login'); // Redirect if not logged in
    }

    const storedRecents = JSON.parse(
      localStorage.getItem('recent_events') || '[]'
    );
    setRecentEvents(storedRecents);
  }, [navigate, user]);

  interface Event {
    _id: string;
    title: string;
  }

  const handleRecentClick = (id: string) => {
    navigate(`/event/${id}`); // Navigate to the clicked recent event
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    navigate(`/day-view/${today}`); // Navigate to the Day View page with today's date
  };

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.clear();

    // Redirect to the login page
    navigate('/login');
  };

  const toggleCollapsible = () => {
    setIsOpen(!isOpen); // Toggle the collapsible state
  };

  return (
    <Sidebar className='bg-[#3C1517] text-white min-h-screen'>
      {/* Header */}
      <SidebarHeader className='flex items-center border-b border-[#3C1517] justify-center py-4'>
        <Link
          to='/dashboard'
          className='text-4xl font-bold font-modak text-[#F9ECEA]'
        >
          EVENTIFY
        </Link>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className='flex-1 px-2'>
        <SidebarMenu>
          {/* Dashboard Link */}
          <SidebarMenuItem>
            <Link to='/dashboard'>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          {/* Today Link */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleTodayClick}>
              Today
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Recent Dropdown */}
          <SidebarMenuItem>
            <Collapsible open={isOpen} className='group/collapsible'>
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <div className='flex items-center justify-between'>
                    <span>Recent</span>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={toggleCollapsible}
                      >
                        {isOpen ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        )}
                        <span className='sr-only'>Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    {recentEvents.map((event) => (
                      <SidebarMenuButton
                        key={event._id}
                        onClick={() => handleRecentClick(event._id)}
                        className='text-white text-xl font-normal hover:underline hover:bg-transparent'
                      >
                        {event.title}
                      </SidebarMenuButton>
                    ))}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className='px-2 py-3 border-t border-gray-600'>
        <div className='flex flex-row items-start gap-2'>
          <div className='flex flex-col'>
            <p className='text-lg font-semibold'>{user.username || 'Guest'}</p>
            <p className='text-sm'>{user.email || 'No email available'}</p>
          </div>
          <Button
            onClick={handleLogout}
            className='mt-4 bg-muted-foreground-600 hover:bg-muted-foreground-700 text-white px-1 py-1 rounded-lg'
          >
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default CustomSidebar;
