import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { APP_LOGO, APP_MENU, APP_AUTH } from "./components/Navbar.constants";
import { AuthProvider } from "./context/AuthContext";
import { ROUTES } from "./constants/routes.constants";
import "./App.css";
import {
  HomePage,
  HabitsPage,
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
} from "./pages";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar logo={APP_LOGO} menu={APP_MENU} auth={APP_AUTH} />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.HABITS} element={<HabitsPage />} />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
