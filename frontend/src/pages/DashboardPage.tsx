import Dashboard from "@/components/Dashboard";
import CustomSidebar from "@/components/CustomSidebar";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

function DashboardPage ({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-screen'>
      <SidebarProvider>
        <CustomSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
      <Dashboard />
    </div>
  );
};
export default DashboardPage;
