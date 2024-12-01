import { useState, useEffect } from 'react';

const photos = [
  'promo1.png',
  'promo2.png',
  'promo3.png',
  'promo4.png',
  'promo5.png',
  'promo6.png',
  'promo7.png',
  'promo8.png',
  'promo9.png',
  'promo10.png',
];

function PromoPhoto() {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * photos.length);
    setCurrentPhoto(randomIndex);
  }, []);

  return (
    <div className='relative w-full h-full'>
      <img
        src={photos[currentPhoto]}
        alt='Promo Photo'
        className='w-full h-full object-cover'
      />
      <div className='absolute inset-0 flex flex-col gap-6 sm:gap-8 items-center justify-center text-white text-xl sm:text-3xl font-semibold bg-black bg-opacity-40 p-4 font-mohave overflow-hidden'>
        <h1 className='truncate'>MAKE PLANS</h1>
        <h1 className='truncate'>SEND INVITES</h1>
        <h1 className='truncate'>CREATE MEMORIES</h1>
      </div>
    </div>
  );
}

export default PromoPhoto;
