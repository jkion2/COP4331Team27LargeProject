import { useState, useEffect } from 'react';

const photos = ['promo1.png', 'promo2.png', 'promo3.png', 'promo4.png', 'promo5.png', 'promo6.png', 'promo7.png', 'promo8.png', 'promo9.png', 'promo10.png'];

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
      <div className='flex flex-col absolute font-mohave inset-0 gap-8 items-center justify-center text-white text-3xl font-semibold bg-black bg-opacity-20'>
        <h1>MAKE PLANS</h1>
        <h1>SEND INVITES</h1>
        <h1>CREATE MEMORIES</h1>
      </div>
    </div>
  );
}

export default PromoPhoto;
