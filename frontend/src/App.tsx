import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; import './App.css';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventPage from './pages/EventPage';
import DayViewPage from './pages/DayViewPage';

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
    </Routes>
  </Router>
);
}
export default App;