import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Hero from "./components/LandingPage/Hero";
import Stats from "./components/LandingPage/Stats";
import Marquee from "./components/LandingPage/Marquee";
import Problems from "./components/LandingPage/Problems";
import { isAuthenticated } from "./utils/auth";

import { Suspense, lazy } from "react";

const Auth = lazy(() => import("./Auth"));
const SearchPage = lazy(() => import("./components/Search/SearchPage"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const Dashboard = lazy(() => import("./components/Dashboard&Post/Dashboard"));
const VerifyOTP = lazy(() => import("./components/Auth/VerifyOTP"));
const CompleteProfile = lazy(
  () => import("./components/Profile/CompleteProfile"),
);
const PostPage = lazy(() => import("./components/Dashboard&Post/PostPage"));
const MeetTheTeam = lazy(() => import("./Meet_the_team"));

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function PageLoader() {
  return <div className="page-loader">Loading...</div>;
}

function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Hero />
        <hr className="section-divider" />
        <Stats />
        <Marquee />
        <Problems />
      </main>
      <Footer />
    </>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-content">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/auth"
        element={
          <Suspense fallback={<PageLoader />}>
            <Auth />
          </Suspense>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <Suspense fallback={<PageLoader />}>
            <VerifyOTP />
          </Suspense>
        }
      />

      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CompleteProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <AppLayout>
            <Profile />
          </AppLayout>
        }
      />
      <Route
        path="/team"
        element={
          <AppLayout>
            <MeetTheTeam />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
