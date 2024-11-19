import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button'; // Assuming your ShadCN button is in './ui/button'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');

  const [activeTab, setActiveTab] = useState('yourEvents'); // Default tab

  const renderContent = () => {
    switch (activeTab) {
      case 'yourEvents':
        return <p>Your Events will be displayed here.</p>;
      case 'upcomingEvents':
        return <p>Upcoming Events will be displayed here.</p>;
      case 'pastEvents':
        return <p>Past Events will be displayed here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col h-screen w-screen bg-gray-100'>
      {/* Header */}
      <header className='flex items-center justify-between px-6 py-4 bg-white text-white'>
        <div>
          <Link to='/dashboard' className='font-modak text-5xl text-[#98383B]'>
            EVENTIFY
          </Link>
        </div>
      </header>

      {/* Welcome Message */}
      <div className='px-6 py-4'>
        <h1 className='text-3xl font-semibold'>
          Welcome, <span className='text-[#98383B]'>{user.username}</span>
        </h1>
      </div>

      {/* Events Dashboard */}
      <div className='flex flex-col justify-center items-center px-6 py-4'>
        <h2 className='text-6xl font-normal mb-8 text-[#3C1517]'>
          Events Dashboard
        </h2>

        {/* Tabs */}
        <div className='flex gap-8 mb-6'>
          <Button
            onClick={() => setActiveTab('yourEvents')}
            className={`${
              activeTab === 'yourEvents'
                ? 'bg-[#98383B] text-white'
                : 'bg-white border border-[#98383B] text-[#98383B]'
            }`}
            size='lg'
          >
            Your Events
          </Button>
          <Button
            onClick={() => setActiveTab('upcomingEvents')}
            className={`${
              activeTab === 'upcomingEvents'
                ? 'bg-[#98383B] text-white'
                : 'bg-white border border-[#98383B] text-[#98383B]'
            }`}
            size='lg'
          >
            Upcoming Events
          </Button>
          <Button
            onClick={() => setActiveTab('pastEvents')}
            className={`${
              activeTab === 'pastEvents'
                ? 'bg-[#98383B] text-white'
                : 'bg-white border border-[#98383B] text-[#98383B]'
            } `}
            size='lg'
          >
            Past Events
          </Button>
        </div>

        {/* Tab Content */}
        <div className='p-4 bg-white border rounded shadow'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
