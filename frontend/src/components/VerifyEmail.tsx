import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function VerifyEmail({ userId, email }: { userId: string; email: string }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track if verification was successful

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take the last character
    setCode(newCode);

    // Automatically focus on the next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to the previous input on backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');
    if (verificationCode.length < 6) {
      setMessage('Please complete the verification code.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/verify-email', {
        method: 'POST',
        body: JSON.stringify({ userId, verificationCode }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (res.error) {
        setMessage(res.error);
        setIsSuccess(false);
      } else {
        setMessage('Email verified successfully!');
        setIsSuccess(true);
      }
    } catch (error: any) {
      alert(error.toString());
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2 px-48'>
      <div className='font-modak text-8xl mt-20 text-[#98383B]'>EVENTIFY</div>
      <h1 className='mt-16 mb-6'>Verify Your Email</h1>
      <p className='mb-6'>We sent a verification code to {email}</p>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-12'
      >
        <div className='flex gap-4'>
          {code.map((digit, index) => (
            <Input
              key={index}
              id={`code-input-${index}`}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className='w-16 h-24 text-center border border-black/50 rounded-2xl text-xl'
            />
          ))}
        </div>
        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-2xl w-full h-12 font-normal rounded-2xl'
        >
          Verify
        </Button>
      </form>
      {message && (
        <p
          className={`mt-4 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          } text-center`}
        >
          {message}
          {isSuccess && (
            <Link
              to='/login'
              className='block mt-2 text-blue-600 underline hover:text-blue-800'
            >
              Please login
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

export default VerifyEmail;
