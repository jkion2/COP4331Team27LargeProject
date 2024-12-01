import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar'; // Ensure this path matches your project

function CustomSidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');

  // Redirect to login if no user data is found
  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login'); // Adjust the path to your login route
    }
  }, [user, navigate]);

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
          <SidebarMenuItem>
            <SidebarMenuButton>Today</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Recent</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Notifications</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className='px-4 py-6 border-t border-gray-600'>
        <p className='text-lg font-semibold'>{user.username || 'Guest'}</p>
        <p className='text-sm'>{user.email || 'No email available'}</p>
      </SidebarFooter>
    </Sidebar>
  );
}

export default CustomSidebar;
