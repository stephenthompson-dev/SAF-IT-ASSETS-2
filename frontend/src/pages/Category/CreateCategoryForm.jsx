// src/components/Categories/CreateCategoryForm.jsx

import React from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { categoryFormFields, initialCategoryValues } from './categoryFormConfig';
import { createCategorySchema } from '../validationSchemas';
import api from '../../api';  // Your Axios instance (session-based auth)

const CreateCategoryForm = () => {
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    api.post('/categories/', values)
      .then(response => {
        // Handle success, reset form or display a success message
        resetForm();
        alert('Category created successfully!');
      })
      .catch(error => {
        // Handle errors, display error messages
        console.error(error);
        alert('Error creating category.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DetailsFormComponent
      schema={createCategorySchema}
      onSubmit={onSubmit}
      fields={categoryFormFields}
      initialValues={initialCategoryValues}
      title="Create Category"
    />
  );
};

export default CreateCategoryForm;
