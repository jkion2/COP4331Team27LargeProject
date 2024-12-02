import React from 'react';
import { useParams } from 'react-router-dom';
import CustomSidebar from '@/components/CustomSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DayView from '@/components/DayView';

function DayViewPage() {
  const { date } = useParams(); // Extract date from URL

  return (
    <div className='flex w-screen h-screen relative'>
      <SidebarProvider>
        <CustomSidebar />
        <div className='flex flex-col flex-1'>
          <SidebarTrigger className='absolute ml-2 top-2 left-auto right-auto z-20' />
          {/* Pass the date from URL to DayView */}
          <DayView date={date} />
        </div>
      </SidebarProvider>
    </div>
  );
}

export default DayViewPage;
