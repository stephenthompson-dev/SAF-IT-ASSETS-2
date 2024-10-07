// src/components/CreateAssetForm.jsx
import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { assetFormFields, initialAssetValues } from './assetFormConfig';
import { createAssetSchema } from '../validationSchemas';
import api from '../../api';  // Your Axios instance (session-based auth)

const CreateAssetForm = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    // Fetch categories to populate the select options
    api.get('/categories/')
      .then(response => {
        const categories = response.data;
        const options = categories.map(category => ({
          value: category.id,
          label: category.name,
        }));
        setCategoryOptions(options);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Update the form fields with category options
  const fieldsWithCategories = assetFormFields.map(field => {
    if (field.name === 'category') {
      return { ...field, options: categoryOptions };
    }
    return field;
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    api.post('/assets/', values)
      .then(() => {
        // Handle success, reset form or show success message
        resetForm();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DetailsFormComponent
      schema={createAssetSchema}
      onSubmit={onSubmit}
      fields={fieldsWithCategories}
      initialValues={initialAssetValues}
      title="Create Asset"
    />
  );
};

export default CreateAssetForm;
