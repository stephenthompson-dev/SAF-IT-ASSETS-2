// src/components/Categories/EditCategoryForm.jsx

import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { categoryFormFields } from './categoryFormConfig';
import { updateCategorySchema } from '../validationSchemas';
import api from '../../api';  // Axios for session-based auth
import { useParams, useNavigate } from 'react-router-dom';

const EditCategoryForm = () => {
  const { id } = useParams();  // Using React Router for getting category id
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    // Fetch category details by ID
    api.get(`/categories/${id}/`)
      .then(response => {
        const data = response.data;
        setInitialValues({
          category_name: data.category_name,
        });
      })
      .catch(error => {
        console.error('Error fetching category:', error);
        alert('Error fetching category details.');
      });
  }, [id]);

  const onSubmit = (values, { setSubmitting }) => {
    api.put(`/categories/${id}/`, values)
      .then(() => {
        // Handle success, redirect or display a success message
        alert('Category updated successfully!');
        navigate('/categories');
      })
      .catch(error => {
        // Handle errors, display error messages
        console.error(error);
        alert('Error updating category.');
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
      schema={updateCategorySchema}
      onSubmit={onSubmit}
      fields={categoryFormFields}
      initialValues={initialValues}
      title="Edit Category"
    />
  );
};

export default EditCategoryForm;
