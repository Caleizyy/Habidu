import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/navbar';
import { APP_LOGO, APP_MENU, APP_AUTH } from './constants/NavBar.constants';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './constants/Routes.constants';
import './App.css';
import {
  HomePage,
  HabitsPage,
  TrackingHabitsPage,
  ProfilePage,
  FriendsPage,
  AchievementsPage,
  LogInPage,
  SignUpPage,
  CalendarPage,
  RequestsPage,
  GroupsPage,
  AboutPage,
  LeaderboardsPage,
  NotFoundPage,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar logo={APP_LOGO} menu={APP_MENU} auth={APP_AUTH} />
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
          <Route path={ROUTES.LOGIN} element={<LogInPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
