import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/navbar';
import { APP_LOGO, APP_MENU } from './constants/NavBar.constants';
import { ROUTES } from './constants/Routes.constants';
import './App.css';
import {
  HomePage,
  HabitsPage,
  TrackingHabitsPage,
  GroupActivityPage,
  ProfilePage,
  FriendsPage,
  RequestsPage,
  GroupsPage,
  GroupDetailPage,
  AboutPage,
  SignInPage,
  NotFoundPage,
} from './pages';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <>
          <NavBar logo={APP_LOGO} menu={APP_MENU} />
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.HABITS} element={<HabitsPage />} />
            <Route path={ROUTES.TRACKING} element={<TrackingHabitsPage />} />
            <Route path={ROUTES.GROUP_ACTIVITY} element={<GroupActivityPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.FRIENDS} element={<FriendsPage />} />
            <Route path={ROUTES.REQUESTS} element={<RequestsPage />} />
            <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
            <Route path={ROUTES.GROUP_DETAIL} element={<GroupDetailPage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
        </>
      ) : (
        <SignInPage />
      )}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
