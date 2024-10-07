// src/components/Users/CreateUserForm.jsx

import React from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { userFormFields, initialUserValues } from './userFormConfig';
import { createUserSchema } from '../validationSchemas';
import api from '../../api';  // Axios instance for session-based authentication

const CreateUserForm = () => {
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    api.post('/users/', values)
      .then(response => {
        resetForm();
        alert('User created successfully!');
      })
      .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DetailsFormComponent
      schema={createUserSchema}
      onSubmit={onSubmit}
      fields={userFormFields}
      initialValues={initialUserValues}
      title="Create User"
    />
  );
};

export default CreateUserForm;
