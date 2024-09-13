import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Assets from './pages/Assets'
import Assignments from './pages/Assignments'
import ProtectedRoute from './components/ProtectedRoutes';
import SideBar from './components/sidebar';


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><SideBar /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;