import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import VerifyEmail from './VerifyEmail';

function Register() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); // Tracks if passwords match
  const [step, setStep] = useState('register');
  const [userId, setUserId] = useState('');

  // Password criteria regex
  const passwordCriteria = {
    length: /.{8,}/,
    number: /[0-9]/,
    symbol: /[@$!%*?&]/,
    uppercase: /[A-Z]/,
  };

  // Tracks individual password strength validations
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    symbol: false,
    uppercase: false,
  });

  // Handle password input and validation
  function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setPassword(value);

    // Update password validation state
    setPasswordValidation({
      length: passwordCriteria.length.test(value),
      number: passwordCriteria.number.test(value),
      symbol: passwordCriteria.symbol.test(value),
      uppercase: passwordCriteria.uppercase.test(value),
    });
  }

  // Handle confirm password input and matching validation
  function handleSetConfirmPassword(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  }

  async function doRegister(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    const allCriteriaMet = Object.values(passwordValidation).every(
      (valid) => valid
    );
    if (!allCriteriaMet) {
      setMessage('Password must meet all strength requirements');
      return;
    }

    if (!passwordMatch) {
      setMessage('Passwords do not match');
      return;
    }

    const obj = { username, email, password };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (!res.userId) {
        setMessage('Registration failed');
      } else {
        setUserId(res.userId);
        setMessage('');
        setStep('verify');
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  if (step === 'verify') {
    return <VerifyEmail userId={userId} email={email} />;
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 px-48'>
      <div className='font-modak text-8xl mt-20 text-[#98383B]'>EVENTIFY</div>
      <h1 className='mb-6'>Sign up</h1>
      <h2 className='mb-6'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='text-[#B74B4B] hover:text-[#6E2D33] cursor-pointer'
        >
          Login
        </Link>
      </h2>
      <form onSubmit={doRegister} className='w-full'>
      
        <Input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mb-6 h-12 border border-black/50 rounded-2xl text-xl'
          required
        />

        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-6 h-12 border border-black/50 rounded-2xl text-xl'
          required
        />

        <Input
          type='password'
          placeholder='Password'
          value={password}
          onChange={handleSetPassword}
          className={`${password ? 'mb-2' : 'mb-6'} h-12 border border-black/50 rounded-2xl text-xl`}
          required
        />
        {password && (<ul className='mb-4 text-sm'>
          <li
            className={
              passwordValidation.length ? 'text-green-600' : 'text-red-600'
            }
          >
            At least 8 characters
          </li>
          <li
            className={
              passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'
            }
          >
            At least 1 uppercase letter
          </li>
          <li
            className={
              passwordValidation.number ? 'text-green-600' : 'text-red-600'
            }
          >
            At least 1 number
          </li>
          <li
            className={
              passwordValidation.symbol ? 'text-green-600' : 'text-red-600'
            }
          >
            At least 1 symbol (@, $, !, %, *, ?, &)
          </li>
        </ul>)}


        <Input
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={handleSetConfirmPassword}
          className='mb-2 h-12 border border-black/50 rounded-2xl text-xl'
          required
        />
        <p
          className={`text-sm mb-4 ${
            passwordMatch ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {confirmPassword && !passwordMatch ? 'Passwords do not match' : ''}
        </p>

        <Button
          type='submit'
          className='bg-[#CC6C67] hover:bg-[#B74B4B] text-2xl w-full h-12 font-normal rounded-2xl'
        >
          Sign up
        </Button>
      </form>
      {message && <p className='mt-4 text-red-600'>{message}</p>}
    </div>
  );
}

export default Register;
