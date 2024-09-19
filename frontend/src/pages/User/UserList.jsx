import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Table from "../../components/Table"; // Import your Table component
import api from '../../api';



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
        const response = await api.get("/api/user/");
        console.log(response.data);
        setUsers(response.data); // Set the fetched user data
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        setError(err.message); // Handle errors
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  // Define event handlers for table actions
  const handleCreate = () => {
    navigate("/create-user"); // Navigate to the create user form
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await api.put(`/api/user/${updatedUser.id}/`, updatedUser); // Update user on the server
      console.log("Updated user:", response.data);

      // Update the local user data
      setUsers((prevUsers) => 
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDetails = (row) => {
    console.log("View details for:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete user:", row);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div>
      <Table
        columns={columns}
        data={users}
        onCreate={handleCreate}
        onDetails={handleDetails}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Users;
