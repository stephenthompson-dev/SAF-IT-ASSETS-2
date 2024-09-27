import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../api';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const RequestDetailsForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [fields, setFields] = useState([
    {
      name: 'user',
      type: 'text',
      label: 'User',
      readOnly: true, // Make the user field read-only
    },
    {
      name: 'asset',
      type: 'select',
      label: 'Asset',
      options: [],
      placeholder: 'Select an asset',
    },
    { name: 'for_date', type: 'date', label: 'For Date' },
    { name: 'end_date', type: 'date', label: 'End Date' },
    {
      name: 'further_notice',
      type: 'checkbox',
      label: 'Until Further Notice',
    },
    { name: 'approved', type: 'checkbox', label: 'Approved' },
    { name: 'approved_date', type: 'date', label: 'Approved Date', readOnly: true},
    {
      name: 'approved_by',
      type: 'text',
      label: 'Approved By',
      readOnly: true, // Make the approved_by field read-only
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validation schema
// Validation schema
const detailsSchema = Yup.object().shape({
  asset: Yup.number().required('Asset is required'),
  for_date: Yup.date().required('For date is required'),
  end_date: Yup.date().when('further_notice', {
    is: false,
    then: (schema) =>
      schema.required(
        'End date is required when "Until Further Notice" is unchecked'
      ),
    otherwise: (schema) => schema.nullable(),
  }),
  further_notice: Yup.boolean(),
  approved: Yup.boolean(),
  approved_date: Yup.date().nullable(),
});


  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assets
        const assetsResponse = await api.get('/assets/');
        const assetOptions = assetsResponse.data.map((asset) => ({
          value: asset.id,
          label: asset.asset_name,
        }));

        // Fetch request details
        const requestResponse = await api.get(`/requests/${requestId}/`);

        // Set initial values
        setInitialValues({
          ...requestResponse.data,
        });

        // Update fields with asset options
        setFields((prevFields) =>
          prevFields.map((field) => {
            if (field.name === 'asset') {
              return { ...field, options: assetOptions };
            }
            return field;
          })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  // Handle form submission (update request)
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Prepare submission values
      const submissionValues = { ...values };

      // Remove read-only fields from submission
      delete submissionValues.user;
      delete submissionValues.approved_by;

      await api.put(`/requests/${requestId}/`, submissionValues);
      console.log('Request updated successfully');
      navigate('/requests');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('An unexpected error occurred:', error);
        setError('Failed to update request.');
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
      initialValues={initialValues}
      title="Edit Request"
    />
  );
};

export default RequestDetailsForm;
