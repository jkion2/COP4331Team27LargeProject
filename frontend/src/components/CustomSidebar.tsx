import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from './ui/sidebar'; // Ensure this path matches your project

function CustomSidebar() {
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');

  return (
    <Sidebar className='bg-[#3C1517] text-white min-h-screen'>
      {/* Header */}
      <SidebarHeader className='flex items-center justify-center py-4'>
        <Link to='/dashboard' className='text-4xl font-bold font-modak text-[#98383B]'>
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

          {/* At a Glance (Collapsible) */}
          <SidebarMenuItem>
            <SidebarGroup>
              <SidebarGroupLabel>At a Glance</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Recent Events</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Notifications</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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
