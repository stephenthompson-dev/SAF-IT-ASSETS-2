import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { AssetList, AssignmentList, CategoryList, RequestList, UserList } from './pages/mainExport';
import { CreateAssetForm, CreateCategoryForm, CreateRequestForm, CreateUserForm } from './pages/mainExport';
import { EditAssetForm, EditCategoryForm, EditRequestForm, EditUserForm } from './pages/mainExport';
import ProtectedRoute from './components/UI/ProtectedRoutes';  // Your new ProtectedRoute
import SideBar from './components/UI/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';

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

          {/* Protected routes that require authentication */}
          <Route path="/" element={<ProtectedRoute><SideBar /></ProtectedRoute>}>
            <Route index element={<Home />} />

            {/* Routes accessible to any authenticated user */}
            <Route path="assets" element={<AssetList />} />
            <Route path="assets/create" element={<CreateAssetForm />} />
            <Route path="assets/edit/:id" element={<EditAssetForm />} />

            <Route path="assignments" element={<AssignmentList />} />

            {/* Request routes accessible to any authenticated user */}
            <Route path="requests" element={<RequestList />} />
            <Route path="requests/create" element={<CreateRequestForm />} />
            <Route path="requests/edit/:id" element={<EditRequestForm />} />

            {/* Category routes, some restricted to admin */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<ProtectedRoute requiredRole="admin"><CreateCategoryForm /></ProtectedRoute>} />
            <Route path="categories/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditCategoryForm /></ProtectedRoute>} />

            {/* User routes (admin only) */}
            <Route path="users" element={<ProtectedRoute requiredRole="admin"><UserList /></ProtectedRoute>} />
            <Route path="users/create" element={<ProtectedRoute requiredRole="admin"><CreateUserForm /></ProtectedRoute>} />
            <Route path="users/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditUserForm /></ProtectedRoute>} />

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
