import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventPage from './pages/EventPage';
import DayViewPage from './pages/DayViewPage';
import ResetReqPage from './pages/ResetReqPage'; // Import ResetReqPage
import ResetFormPage from './pages/ResetFormPage'; // Import ResetFormPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<RegisterPage />} />
        <Route path='/cards' element={<CardPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/event/:eventId' element={<EventPage />} />
        <Route path='/day-view/:date' element={<DayViewPage />} />
        <Route path='/reset-password' element={<ResetReqPage />} />{' '}
        <Route path='/reset-password/:resetToken' element={<ResetFormPage />} />{' '}
      </Routes>
    </Router>
  );
}

export default App;
