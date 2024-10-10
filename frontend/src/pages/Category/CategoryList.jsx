// src/components/Categories/CategoryList.jsx

import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';  // Adjust the path if necessary
import api from '../../api';  // Your Axios instance (session-based auth)
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Access user info from AuthContext

  useEffect(() => {
    // Fetch user information to determine admin status

    // Fetch categories from the backend
    api.get('/categories/')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        alert('Error fetching categories.');
      });
  }, []);

  // Define table columns
  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Category Name', accessor: 'category_name' },
  ];

  // Define action handlers
  const handleCreate = () => {
    navigate('/categories/create');
  };

  const handleEdit = (row) => {
    navigate(`/categories/edit/${row.id}`);
  };

  const handleDelete = (row) => {
    api.delete(`/categories/${row.id}/`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== row.id));
        alert('Category deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting category:', error);
        alert('Error deleting category.');
      });
  };

  return (
    <div className="p-4">
      <Table
        columns={columns}
        data={categories}
        onCreate={user.role == "admin"? handleCreate : null}
        title="Categories"
        showCreateButton={user.role == 'admin'}
        onEdit={user.role == 'admin' ? handleEdit : null}
        onDelete={user.role == 'admin' ? handleDelete : null}
      />
    </div>
  );
};

export default CategoryList;
