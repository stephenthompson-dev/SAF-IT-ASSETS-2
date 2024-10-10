import React, { useEffect, useState } from 'react';
import api from '../api'; // Adjust the path to your Axios instance as needed
import { useAuth } from '../contexts/AuthContext'; // Assuming you're using an AuthContext for user info
import Table from '../components/UI/Table'; // Adjust the path to your Table component as needed
import { toast } from 'react-toastify'; // For notifications

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth(); // Use the logged-in user from the auth context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/assignments/'); // Fetch all assignments
        const userAssignments = response.data.filter(
          (assignment) => assignment.user === user.username && !assignment.returned
        ); // Filter assignments for the logged-in user and those that are not returned
        setAssignments(userAssignments);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        toast.error('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAssignments(); // Fetch only if the user is available
    }
  }, [user]);

  // Define table columns
  const columns = [
    { Header: 'Asset', accessor: 'asset' },
    { Header: 'Request', accessor: 'request' },
    { Header: 'Assignment Date', accessor: 'assignment_date' },
    { Header: 'Return Date', accessor: 'return_date' },
    { Header: 'Returned', accessor: 'returned' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My Active Assignments</h1>
      <Table
        columns={columns}
        data={assignments}
        title="Active Assignments"
        showCreateButton={false} // No need for a create button on the home page
      />
    </div>
  );
};

export default Home;