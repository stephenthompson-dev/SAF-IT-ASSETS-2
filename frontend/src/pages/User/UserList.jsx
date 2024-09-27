import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Users = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); 

  // Define the columns for the table
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Username", accessor: "username" },
    { Header: "First Name", accessor: "first_name" },
    { Header: "Last Name", accessor: "last_name" },
    { Header: "Email", accessor: "email" },
  ];

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/");
        setUsers(response.data); // Set the fetched user data
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  // Define event handlers for table actions
  const handleCreate = () => {
    navigate("/create-user"); // Navigate to the create user form
  };

  const handleEdit = (selectedRow) => {
    // Navigate to the edit page for the selected user
    navigate(`/users/${selectedRow.id}/edit`);
  };

  const handleDelete = async (selectedRow) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${selectedRow.id}/`);
        // Remove the deleted user from the state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedRow.id));
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
        setError("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div>
      <Table
        title="Users"
        columns={columns}
        data={users}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Users;
