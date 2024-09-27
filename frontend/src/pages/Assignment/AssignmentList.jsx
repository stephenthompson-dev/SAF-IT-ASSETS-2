import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]); // State to store assignment data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); 

  // Define the columns for the table
  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "User", accessor: "user_first_name" },
    { Header: "Asset", accessor: "asset_name" },
    { Header: "Return Date", accessor: "return_date" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/assignments/");
        // Map the data to flatten nested objects for the table
        const fetchedAssignments = response.data.map((assignment) => ({
          ...assignment,
          user_first_name: assignment.user.first_name,
          asset_name: assignment.asset.asset_name,
        }));
        setAssignments(fetchedAssignments); // Set the fetched assignment data
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); 
  }, []);

  const handleCreate = () => {
    navigate("/create-assignment");
  };

  const handleEdit = (selectedRow) => {
    // Navigate to the edit page for the selected assignment
    navigate(`/assignments/${selectedRow.id}/edit`);
  };

  const handleDelete = async (selectedRow) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/assignments/${selectedRow.id}/`);
        // Remove the deleted assignment from the state
        setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== selectedRow.id));
        console.log("Assignment deleted successfully");
      } catch (error) {
        console.error("Failed to delete assignment:", error);
        setError("Failed to delete assignment.");
      }
    }
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
        title="Assignments"
        columns={columns}
        data={assignments}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showCreateButton={false} // Assuming you don't want a "Create" button for assignments
      />
    </div>
  );
};

export default Assignments;
