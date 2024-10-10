// src/components/Users/EditUserForm.jsx

import React, { useEffect, useState } from 'react';
import { userFormFields } from './userFormConfig';
import { updateUserSchema } from '../validationSchemas';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import api from '../../api';  // Axios instance for session-based authentication
import { useParams, useNavigate } from 'react-router-dom';

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}/`)
      .then(response => {
        const data = response.data;
        setInitialValues({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          is_superuser: data.is_superuser,
          password1: '',
          password2: '',
        });
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        alert('Error fetching user details.');
      });
  }, [id]);

  const onSubmit = (values, { setSubmitting }) => {
    api.put(`/users/${id}/`, values)
      .then(response => {
        alert('User updated successfully!');
        navigate('/users');
      })
      .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <DetailsFormComponent
      schema={updateUserSchema}
      onSubmit={onSubmit}
      fields={userFormFields}
      initialValues={initialValues}
      title="Edit User"
    />
  );
};

export default EditUserForm;
