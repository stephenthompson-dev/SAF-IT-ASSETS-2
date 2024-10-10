// ../../components/Assignments/AssignmentList.jsx
import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table'; // Adjust the path if necessary
import api from '../../api'; // Your Axios instance (session-based auth)
import useAuth from '../../hooks/useAuth'; // Custom hook for auth context
import { toast } from 'react-toastify';


const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Access user info from AuthContext

  const getAssignments = () => {
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
  }

  useEffect(() => {
    // Fetch assignments
    getAssignments()
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

  const handleReturn = async (row) => {
    debugger
    if (user.username == row.user){
      toast.error("Another admin must confirm your returnal")
      return
    }

    if (window.confirm('Are you sure you want to return this asset?')){
      const updatedData = {
        user: row.user,
        asset: row.asset,
        request: row.request,
        assignment_date: row.assignment_date,
        return_date: row.return_date,
        returned: true,
      };
    
      try 
      {
        const response = await api.put(`/assignments/${row.id}/`, updatedData);
        await getAssignments();
        toast.success('Asset returned')

      }
      catch (error)
      {
        toast.error("There was an error processing return seek admin help")
        console.log(error)
      }
    } 
  }; 

  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={tableData}
        title="Assignments"
        showCreateButton={false}  // No create button for assignments
        onApprove={user.role == 'admin' ? handleReturn : null}
        onApproveText='Return'
      />
    </div>
  );
};

export default AssignmentList;
