// src/components/Users/UserList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';
import { toast } from 'react-toastify';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Username", accessor: "username" },
    { Header: "First Name", accessor: "first_name" },
    { Header: "Last Name", accessor: "last_name" },
    { Header: "Email", accessor: "email" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    navigate("/users/create");
  };

  const handleEdit = (selectedRow) => {
    navigate(`/users/edit/${selectedRow.id}/`);
  };

  const handleDelete = async (selectedRow) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${selectedRow.id}/`);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedRow.id));
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-4">
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
