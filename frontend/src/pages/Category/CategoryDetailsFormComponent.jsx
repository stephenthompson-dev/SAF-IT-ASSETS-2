import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../api';
import DetailsFormComponent from '../../components/UI/DetailsFormComponent';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const CategoryDetailsForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ category_name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validation schema
  const detailsSchema = Yup.object().shape({
    category_name: Yup.string()
      .required('Category name is required')
      .max(100, 'Cannot be longer than 100 characters'),
  });

  // Fetch category details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await api.get(`/categories/${categoryId}/`);
        setInitialValues(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Failed to fetch category details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Handle form submission (update category)
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await api.put(`/categories/${categoryId}/`, values);
      console.log('Category updated successfully');
      navigate('/categories');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('An unexpected error occurred:', error);
        setError('Failed to update category.');
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

  const fields = [
    { name: 'category_name', type: 'text', label: 'Category Name' },
  ];

  return (
    <DetailsFormComponent
      schema={detailsSchema}
      onSubmit={handleSubmit}
      fields={fields}
      initialValues={initialValues}
      title="Edit Category"
    />
  );
};

export default CategoryDetailsForm;
