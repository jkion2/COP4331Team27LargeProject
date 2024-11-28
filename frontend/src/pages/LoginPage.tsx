import PromoPhoto from '../components/PromoPhoto.tsx';
import Login from '../components/Login.tsx';

const LoginPage = () => {
  return (
    <div className='flex flex-row h-screen w-screen'>
      <div className='flex-1'>
        <Login />
      </div>
      <div className='flex-1'>
        <PromoPhoto />
      </div>
    </div>
  );
};

export default LoginPage;
