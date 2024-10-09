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

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests/');
      let data = response.data;

      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error fetching requests.');
    }
  };

  useEffect(() => {
    // Fetch requests whenever isAdmin or user.id changes
    fetchRequests();
  }, [isAdmin, user]);

  // Define table columns
  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'User', accessor: 'user' },
    { Header: 'Asset', accessor: 'asset' },
    { Header: 'For Date', accessor: 'for_date' },
    { Header: 'End Date', accessor: 'end_date' },
    { Header: 'Approved', accessor: 'approved' },
    { Header: 'Approved Date', accessor: 'approved_date' },
    { Header: 'Approved By', accessor: 'approved_by' },
  ];

  const handleCreate = () => {
    navigate('/requests/create');
  };

  const handleEdit = (row) => {
    if (row.approved_by){
      toast.error("Cannot edit approved request")
      return
    }
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
    if (user.username == row.user){
      toast.error("you cannot approve your own request")
      return
    }
    debugger
    if (window.confirm('Are you sure you want to approve this request?')) {
      const approved_by = user.id; // Assuming user object has an 'id' field

      const updatedData = {
        approved: true,
        approved_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        approved_by: approved_by,
        asset: row.asset,
        for_date: row.for_date,
        end_date: row.end_date,
      };

      try {
        const response = await api.put(`/requests/${row.id}/`, updatedData);
        await fetchRequests();
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
        onCreate={handleCreate}
        title="Requests"
        onEdit={user.role == 'admin'? handleEdit : null}
        onDelete={user.role == 'admin' ? handleDelete : null}
        onApprove={user.role == 'admin' ? handleApprove : null}
      />
    </div>
  );
};

export default RequestList;
