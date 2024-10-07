import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { AssetList, AssignmentList, CategoryList, RequestList, UserList } from './pages/mainExport'
import { CreateAssetForm, CreateCategoryForm, CreateRequestForm, CreateUserForm } from './pages/mainExport'
import { EditAssetForm, EditCategoryForm, EditRequestForm, EditUserForm } from './pages/mainExport'
import ProtectedRoute from './components/UI/ProtectedRoutes';
import SideBar from './components/UI/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from './contexts/AuthContext';


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><SideBar /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="assets" element={<AssetList />} />
            <Route path="assets/create" element={<CreateAssetForm />} />
            <Route path="assets/edit/:id" element={<EditAssetForm />} />

            <Route path="assignments" element={<AssignmentList />} />


            <Route path="requests" element={<RequestList />} />
            <Route path="requests/create" element={<CreateRequestForm />} />
            <Route path="requests/edit/:id" element={<EditRequestForm />} />


            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CreateCategoryForm />} />
            <Route path="categories/edit/:id" element={<EditCategoryForm />} />


            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<CreateUserForm />} />
            <Route path="users/edit/:id" element={<EditUserForm />} />


            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Logout Route */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;