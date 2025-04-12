import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import Companies from './pages/Companies';
import CompanyProfile from './pages/CompanyProfile';
import SubmitChallenge from './pages/SubmitChallenge';
import MatchResults from './pages/MatchResults';
import FeedbackForm from './pages/FeedbackForm';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:companyId" element={<CompanyProfile />} />
          <Route path="/submit/:challengeId" element={<SubmitChallenge />} />
          <Route path="/match-results" element={<MatchResults />} />
          <Route path="/feedback/:companyId/:candidateId" element={<FeedbackForm />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        </Routes>
      </Container>
    </AuthProvider>
  );
}

export default App;
