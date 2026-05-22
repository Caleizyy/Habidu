import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/navbar';
import { APP_LOGO, APP_MENU } from './constants/NavBar.constants';
import { ROUTES } from './constants/Routes.constants';
import './App.css';
import {
  HomePage,
  HabitsPage,
  TrackingHabitsPage,
  ProfilePage,
  FriendsPage,
  AchievementsPage,
  CalendarPage,
  RequestsPage,
  GroupsPage,
  AboutPage,
  LeaderboardsPage,
  SignInPage,
} from './pages';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <SignInPage />
      ) : (
        <>
          <NavBar logo={APP_LOGO} menu={APP_MENU} />
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.HABITS} element={<HabitsPage />} />
            <Route path={ROUTES.TRACKING} element={<TrackingHabitsPage />} />
            <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
            <Route path={ROUTES.LEADERBOARDS} element={<LeaderboardsPage />} />
            <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.FRIENDS} element={<FriendsPage />} />
            <Route path={ROUTES.REQUESTS} element={<RequestsPage />} />
            <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
            <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
