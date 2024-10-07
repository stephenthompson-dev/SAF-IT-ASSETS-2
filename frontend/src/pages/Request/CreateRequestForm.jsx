// src/components/Requests/CreateRequestForm.jsx

import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { requestFormFields, initialRequestValues } from './requestFormConfig';
import { createRequestSchema } from '../validationSchemas';
import api from '../../api';  // Your Axios instance (session-based auth)

const CreateRequestForm = () => {
  const [assetOptions, setAssetOptions] = useState([]);

  useEffect(() => {
    // Fetch assets to populate the select options
    api.get('/assets/')
      .then(response => {
        const assets = response.data;
        const options = assets.map(asset => ({
          value: asset.id,
          label: asset.asset_name,  // Assuming Asset model has 'asset_name' field
        }));
        setAssetOptions(options);
      })
      .catch(error => {
        console.error('Error fetching assets:', error);
        alert('Error fetching assets.');
      });
  }, []);

  // Update the form fields with asset options
  const fieldsWithAssets = requestFormFields.map(field => {
    if (field.name === 'asset') {
      return { ...field, options: assetOptions };
    }
    return field;
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    api.post('/requests/', values)
      .then(response => {
        resetForm();
        alert('Request created successfully!');
      })
      .catch(error => {
        console.error(error);
        alert('Error creating request.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <DetailsFormComponent
      schema={createRequestSchema}
      onSubmit={onSubmit}
      fields={fieldsWithAssets}
      initialValues={initialRequestValues}
      title="Create Request"
    />
  );
};

export default CreateRequestForm;
