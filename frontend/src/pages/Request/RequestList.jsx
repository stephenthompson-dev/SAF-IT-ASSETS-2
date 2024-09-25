import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';


const Requests = () => {
  const [requests, setRequests] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); 

  // Define the columns for the table
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "User", accessor: "user.username" },  // Assuming there's a 'username' field in 'user'
    { 
      Header: "Name", 
      accessor: (row) => `${row.user.first_name} ${row.user.last_name}`,  // Combine first and last name
    },
    { Header: "For Date", accessor: "for_date" },

  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/requests/");
        console.log(response.data);
        setRequests(response.data); // Set the fetched user data
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
    navigate("/create-request"); // Navigate to the create user form
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
    return <LoadingIndicator/>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div>
      <Table
        title="Requests"
        columns={columns}
        data={requests}
        onCreate={handleCreate}
        onDetails={handleDetails}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Requests;
