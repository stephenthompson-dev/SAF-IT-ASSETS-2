// src/components/EditAssetForm.jsx
import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import { assetFormFields } from './assetFormConfig';
import { updateAssetSchema } from '../validationSchemas';
import api from '../../api';  // Your Axios instance
import { useParams } from 'react-router-dom';

const EditAssetForm = () => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    // Fetch asset details
    api.get(`/assets/${id}/`)
      .then(response => {
        const data = response.data;
        setInitialValues({
          asset_name: data.asset_name,
          purchase_date: data.purchase_date,
          category: data.category,
        });
      })
      .catch(error => {
        console.error('Error fetching asset:', error);
      });

    // Fetch categories to populate the select options
    api.get('/categories/')
      .then(response => {
        const categories = response.data;
        const options = categories.map(category => ({
          value: category.id,
          label: category.category_name,
        }));
        setCategoryOptions(options);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [id]);

  const onSubmit = (values, { setSubmitting }) => {
    api.put(`/assets/${id}/`, values)
      .then(() => {
        // Handle success, e.g., redirect or show success message
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  const fieldsWithCategories = assetFormFields.map(field => {
    if (field.name === 'category') {
      return { ...field, options: categoryOptions };
    }
    return field;
  });

  return (
    <DetailsFormComponent
      schema={updateAssetSchema}
      onSubmit={onSubmit}
      fields={fieldsWithCategories}
      initialValues={initialValues}
      title="Edit Asset"
    />
  );
};

export default EditAssetForm;
