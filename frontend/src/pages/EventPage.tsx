
import CustomSidebar from '@/components/CustomSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import EventDetails from '@/components/EventDetails';

function EventPage() {
  return (
    <div className='flex w-screen h-screen relative'>
      <SidebarProvider>
        <CustomSidebar />
        <div className='flex flex-col flex-1'>
          <SidebarTrigger className='absolute ml-2 top-2 left-auto right-auto z-20' />

          <EventDetails />
        </div>
      </SidebarProvider>
    </div>
  );
}

export default EventPage;
