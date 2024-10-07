// ../../components/Assignments/AssignmentList.jsx
import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table'; // Adjust the path if necessary
import api from '../../api'; // Your Axios instance (session-based auth)

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch assignments
    api.get('/assignments/')
      .then(response => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
        setError('Error fetching assignments.');
        setLoading(false);
      });
  }, []);

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'User', accessor: 'user' },
    { Header: 'Asset', accessor: 'asset' },
    { Header: 'Request', accessor: 'request' },
    { Header: 'Assignment Date', accessor: 'assignment_date' },
    { Header: 'Return Date', accessor: 'return_date' },
    { Header: 'Returned', accessor: 'returned' },
  ];

  const tableData = assignments.map(assignment => ({
    ...assignment,
    returned: assignment.returned ? 'Yes' : 'No',
    return_date: assignment.return_date || 'N/A',
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={tableData}
        title="Assignments"
        showCreateButton={false}  // No create button for assignments
      />
    </div>
  );
};

export default AssignmentList;
