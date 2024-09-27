import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../api'; // Adjust the import path if needed
import DetailsFormComponent from '../../components/UI/DetailsFormComponent'; // Adjust the import path if needed
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const AssetDetailsForm = () => {
  const { assetId } = useParams(); // Get the assetId from the URL
  const navigate = useNavigate(); // For navigation after successful update
  const [initialValues, setInitialValues] = useState(null);
  const [fields, setFields] = useState([
    { name: 'asset_name', type: 'text', label: 'Asset Name' },
    { name: 'purchase_date', type: 'date', label: 'Purchase Date' },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [],
      placeholder: 'Select a category',
    },
    // Add other fields as needed
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validation schema
  const detailsSchema = Yup.object().shape({
    asset_name: Yup.string()
      .required('Asset name is required')
      .max(150, 'Cannot be longer than 150 characters'),
    purchase_date: Yup.date().required('Purchase date is required'),
    category: Yup.string().required('Category is required'),
    // Add validations for other fields as needed
  });

  // Fetch categories and asset details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/categories/');
        const categoryOptions = categoriesResponse.data.map((category) => ({
          value: category.id,
          label: category.category_name,
        }));
        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === 'category'
              ? { ...field, options: categoryOptions }
              : field
          )
        );

        // Fetch asset details
        const assetResponse = await api.get(`/assets/${assetId}/`);
        setInitialValues(assetResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch asset details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetId]);

  // Handle form submission (update asset)
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.put(`/assets/${assetId}/`, values);
      console.log('Asset updated successfully');
      // Optionally, navigate back to the asset list or show a success message
      navigate('/assets'); // Navigate back to the assets list
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('An unexpected error occurred:', error);
        setError('Failed to update asset.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <DetailsFormComponent
      schema={detailsSchema}
      onSubmit={handleSubmit}
      fields={fields}
      initialValues={initialValues} // Pass the initial values to pre-fill the form
      title="Edit Asset"
    />
  );
};

export default AssetDetailsForm;
