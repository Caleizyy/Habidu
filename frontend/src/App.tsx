import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar1 } from './components/navbar1';
import './App.css';
import { CalendarDays, Trophy, Medal, SquareCheckBig, CirclePile, Users, Handshake } from "lucide-react";
import { HomePage, HabitsPage, ProfilePage, FriendsPage, AchievementsPage, LogInPage, SignUpPage, CalendarPage, RequestsPage, GroupsPage, AboutPage, LeaderboardsPage } from './pages';
import logo from './assets/logoipsum-411.png';

function App() {
  const navMenu = [
    //{ title: 'Home', url: '/' },
    {
      title: 'Goals',
      url: '#',
      icon: <CalendarDays className="size-5" />,
      items: [
        {
          title: 'Habits',
          description: 'Create and manage your habits',
          url: '/habits',
          icon: <SquareCheckBig className="size-5" />
        },
        {
          title: 'Calender',
          description: 'Track habit completion over time',
          url: '/calender',
          icon: <CalendarDays className="size-5" />
        },
      ],
    },
    {
      title: 'Progress',
      url: '#',
      items: [
        {
          title: 'Leaderboards',
          description: 'Compete with friends on the leaderboard',
          url: '/leaderboards',
          icon: <Medal className="size-5" />
        },
        {
          title: 'Achievements',
          description: 'Unlock badges and earn milestones',
          url: '/achievements',
          icon: <Trophy className="size-5" />
        },
      ],
    },

    {
      title: 'Connect',
      url: '#',
      items: [
        {
          title: 'Friends',
          description: 'Manage your friend connections',
          url: '/friends',
          icon: <Users className="size-5" />
        },
        {
          title: 'Requests',
          description: 'Accept or decline friend requests',
          url: '/requests',
          icon: <Handshake className="size-5" />
        },
        {
          title: 'Groups',
          description: 'Create and join habit groups with friends',
          url: '/groups',
          icon: <CirclePile className="size-5" />
        },
      ],
    },

    { title: 'About', url: '/about' },
  ];
  

  const navAuth = {
    login: { title: 'Login', url: '/login' },
    signup: { title: 'Sign Up', url: '/signup' },
  };

  const navLogo = {
    url: '/',
    src: logo,
    alt: 'Habit Tracker',
    title: 'Habit Tracker',
  };

  return (
    <BrowserRouter>
      <Navbar1 logo={navLogo} menu={navMenu} auth={navAuth} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/calender" element={<CalendarPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
