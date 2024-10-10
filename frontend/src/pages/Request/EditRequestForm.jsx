// src/components/Requests/EditRequestForm.jsx

import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { requestFormFields } from './requestFormConfig';
import { updateRequestSchema } from '../validationSchemas';
import api from '../../api';  // Your Axios instance (session-based auth)
import { useParams, useNavigate } from 'react-router-dom';

const EditRequestForm = () => {
  const { id } = useParams();  // Assuming you're using React Router
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [assetOptions, setAssetOptions] = useState([]);

  useEffect(() => {
    // Fetch request details
    api.get(`/requests/${id}/`)
      .then(response => {
        const data = response.data;
        setInitialValues({
          asset: data.asset,
          for_date: data.for_date,
          end_date: data.end_date,
          further_notice: data.further_notice,
          approved: data.approved,
          approved_date: data.approved_date,
          approved_by: data.approved_by,
        });
      })
      .catch(error => {
        console.error('Error fetching request:', error);
        alert('Error fetching request details.');
      });

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
  }, [id]);

  const onSubmit = (values, { setSubmitting }) => {
    api.put(`/requests/${id}/`, values)
      .then(() => {
        alert('Request updated successfully!');
        navigate('/requests');
      })
      .catch(error => {
        console.error('Error updating request:', error);
        alert('Error updating request.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  // Update the form fields with asset options
  const fieldsWithAssets = requestFormFields.map(field => {
    if (field.name === 'asset') {
      return { ...field, options: assetOptions };
    }
    return field;
  });

  return (
    <DetailsFormComponent
      schema={updateRequestSchema}
      onSubmit={onSubmit}
      fields={fieldsWithAssets}
      initialValues={initialValues}
      title="Edit Request"
    />
  );
};

export default EditRequestForm;
