// ../../components/Assignments/AssignmentDetailForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../api';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const AssignmentDetailsForm = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [fields, setFields] = useState([
    { name: 'user', type: 'select', label: 'User', options: [], placeholder: 'Select a user' },
    { name: 'asset', type: 'select', label: 'Asset', options: [], placeholder: 'Select an asset' },
    { name: 'request', type: 'select', label: 'Request', options: [], placeholder: 'Select a request' },
    { name: 'assignment_date', type: 'date', label: 'Assignment Date' },
    { name: 'return_date', type: 'date', label: 'Return Date' },
    { name: 'returned', type: 'checkbox', label: 'Returned' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const detailsSchema = Yup.object().shape({
    user: Yup.number().required('User is required'),
    asset: Yup.number().required('Asset is required'),
    request: Yup.number().required('Request is required'),
    assignment_date: Yup.date().required('Assignment date is required'),
    return_date: Yup.date().nullable(),
    returned: Yup.boolean(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get('/users/');
        const assetsResponse = await api.get('/assets/');
        const requestsResponse = await api.get('/requests/');
        const assignmentResponse = await api.get(`/assignments/${assignmentId}/`);

        const userOptions = usersResponse.data.map(user => ({ value: user.id, label: user.username }));
        const assetOptions = assetsResponse.data.map(asset => ({ value: asset.id, label: asset.asset_name }));
        const requestOptions = requestsResponse.data.map(request => ({
          value: request.id,
          label: `Request ${request.id} by ${request.user.username}`,
        }));

        setFields(prevFields => prevFields.map(field => {
          if (field.name === 'user') return { ...field, options: userOptions };
          if (field.name === 'asset') return { ...field, options: assetOptions };
          if (field.name === 'request') return { ...field, options: requestOptions };
          return field;
        }));

        setInitialValues(assignmentResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch assignment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.put(`/assignments/${assignmentId}/`, values);
      navigate('/assignments');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setError('Failed to update assignment.');
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
      title="Edit Assignment"
    />
  );
};

export default AssignmentDetailsForm;
