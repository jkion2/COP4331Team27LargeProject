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
    <div className='flex flex-col h-screen bg-gray-100'>
      {/* Events Dashboard */}
      <div className='flex flex-col justify-start items-center px-6 py-4'>
        <h2 className='text-6xl font-semibold mt-6 mb-16 text-[#3C1517]'>
          Events Dashboard
        </h2>

        {/* Tabs */}
        <div className='flex gap-14 mb-6'>
          <Button
            onClick={() => setActiveTab('yourEvents')}
            className={`text-black text-3xl font-normal bg-transparent rounded-none pt-2 px-1 ${
              activeTab === 'yourEvents' ? 'border-b-4 border-[#98383B]' : ''
            }`}
            size='lg'
            variant='link'
          >
            Your Events
          </Button>
          <Button
            onClick={() => setActiveTab('upcomingEvents')}
            className={`text-black text-3xl font-normal bg-transparent rounded-none pt-2 px-1 ${
              activeTab === 'upcomingEvents'
                ? 'border-b-4 border-[#98383B]'
                : ''
            }`}
            size='lg'
            variant='link'
          >
            Upcoming Events
          </Button>
          <Button
            onClick={() => setActiveTab('pastEvents')}
            className={`text-black text-3xl font-normal bg-transparent rounded-none pt-2 px-1 ${
              activeTab === 'pastEvents' ? 'border-b-4 border-[#98383B]' : ''
            }`}
            size='lg'
            variant='link'
          >
            Past Events
          </Button>
        </div>

        {/* Tab Content */}
        <div className='p-4 bg-white border rounded shadow'>
          {renderContent()}
        </div>
      </div>

      {/* Fixed Button */}
      <Button
        className='fixed bottom-8 right-8 flex flex-row gap-6 bg-[#4d1a1c] text-white py-2 px-8 font-normal rounded-2xl shadow-md h-14 text-xl hover:bg-[#672325]'
        onClick={() => alert('Button clicked!')}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          style={{ width: '30px', height: '36px' }}
        >
          <path
            fill-rule='evenodd'
            d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
            clip-rule='evenodd'
          />
        </svg>
        <div>New Event</div>
      </Button>
    </div>
  );
}

export default Dashboard;
