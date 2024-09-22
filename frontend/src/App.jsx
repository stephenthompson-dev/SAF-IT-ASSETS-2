import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import AssetList from './pages/Asset/AssetList'
import AssignmentList from './pages/Assignment/AssignmentList'
import RequestList from './pages/Request/RequestList';
import { UserList, CreateUser } from './pages/User';
import Categories from './pages/Categories';
import ProtectedRoute from './components/UI/ProtectedRoutes';
import SideBar from './components/UI/sidebar';


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
          <Route path="assets" element={<AssetList />} />
          <Route path="assignments" element={<AssetList />} />
          <Route path="requests" element={<RequestList />} />
          <Route path="categories" element={<Categories />} />

          //#region user Routes
          <Route path="users" element={<UserList />} />
          <Route path="create-user" element={<CreateUser />} />

          //#endregion
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;