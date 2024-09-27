import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { AssetList, CreateAsset, UserList, CreateUser, Categories, CreateCategory, Assginments, Requests, CreateRequest, AssetDetails, CategoryDetails, AssginmentDetails, RequestDetails} from './pages/mainExport';
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
          <Route path="create-asset" element={<CreateAsset />}/>
          <Route path="assets/:assetId/edit" element={<AssetDetails />} />

          <Route path="assignments" element={<Assginments />}/>
          <Route path="assignments/:assignmentId/edit" element={<AssginmentDetails />} />


          <Route path="requests" element={<Requests />} />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="requests/:requestId/edit" element={<RequestDetails />} />


          <Route path="categories" element={<Categories />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="categories/:categoryId/edit" element={<CategoryDetails />} />
          

          <Route path="users" element={<UserList />} />
          <Route path="create-user" element={<CreateUser />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;