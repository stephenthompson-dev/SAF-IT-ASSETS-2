// src/components/Requests/RequestList.jsx

import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table'; // Adjust the path if necessary
import api from '../../api'; // Your Axios instance (session-based auth)
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Custom hook for auth context
import { toast } from 'react-toastify'; // For better notifications

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useAuth(); // Access user info from AuthContext
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    api.get('/auth/me/')
    .then(response => {
      setIsAdmin(response.data.role === 'admin');
      console.log(response.data.role)
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      setIsAdmin(false);  // Default to false if there's an issue fetching user data
    });
    // Fetch requests whenever isAdmin or user.id changes
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/');
        let data = response.data;
  
        // If not admin, filter to only show user's own requests
        if (!isAdmin && user) {
          data = data.filter(request => request.user_id === user.id);
        }
  
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Error fetching requests.');
      }
    };

    fetchRequests();
  }, [isAdmin, user]);

  // Define table columns
  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'User', accessor: 'user' },
    { Header: 'Asset', accessor: 'asset' },
    { Header: 'For Date', accessor: 'for_date' },
    { Header: 'End Date', accessor: 'end_date' },
    { Header: 'Further Notice', accessor: 'further_notice' },
    { Header: 'Approved', accessor: 'approved' },
    { Header: 'Approved Date', accessor: 'approved_date' },
    { Header: 'Approved By', accessor: 'approved_by' },
  ];

  const handleCreate = () => {
    navigate('/requests/create');
  };

  const handleEdit = (row) => {
    navigate(`/requests/edit/${row.id}`);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete request ID ${row.id}?`)) {
      try {
        await api.delete(`/requests/${row.id}/`);
        setRequests(prevRequests => prevRequests.filter(request => request.id !== row.id));
        toast.success('Request deleted successfully!');
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Error deleting request.');
      }
    }
  };

  const handleApprove = async (row) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      const approved_by = user.id; // Assuming user object has an 'id' field

      const updatedData = {
        approved: true,
        approved_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        approved_by: approved_by,
      };

      try {
        const response = await api.put(`/requests/${row.id}/`, updatedData);
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === row.id ? response.data : request
          )
        );
        toast.success('Request approved successfully!');
      } catch (error) {
        console.error('Error approving request:', error);
        toast.error('Error approving request.');
      }
    }
  };

  // Prepare data for the table
  const tableData = requests.map(request => ({
    ...request,
    further_notice: request.further_notice ? 'Yes' : 'No',
    approved: request.approved ? 'Yes' : 'No',
    approved_by: request.approved_by ? request.approved_by : 'N/A',
  }));

  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={tableData}
        onCreate={isAdmin ? handleCreate : null}
        title="Requests"
        showCreateButton={isAdmin}
        onEdit={isAdmin ? handleEdit : null}
        onDelete={isAdmin ? handleDelete : null}
      />
    </div>
  );
};

export default RequestList;
