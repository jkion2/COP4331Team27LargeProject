import Dashboard from "@/components/Dashboard";
import CustomSidebar from "@/components/CustomSidebar";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

function DashboardPage() {
  return (
    <div className='flex w-screen h-screen relative'>
      <SidebarProvider>
        <CustomSidebar />
        <div className='flex flex-col flex-1'>
          <SidebarTrigger className='absolute ml-2 top-2 left-auto right-auto z-20' />

          <Dashboard />
        </div>
      </SidebarProvider>
    </div>
  );
}

export default DashboardPage;
