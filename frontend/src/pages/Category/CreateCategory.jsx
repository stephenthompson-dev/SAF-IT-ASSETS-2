import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api";
import { useEffect, useState } from "react";
import { useNavigate,useLocation } from 'react-router-dom';



const CreateCategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 
  const createCategorySchema = Yup.object().shape({
    category_name: Yup.string().required("Category Name is required").max(150, "Cannot be longer than 150 characters"),
  });

  const fields = [
    { name: "category_name", type: "text", label: "Category Name" },
  ];

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    
    const confirmSubmission = window.confirm(
      "Are you sure you want to create a new category?"
    );
  
    if (!confirmSubmission) {
      setSubmitting(false); // Stop the submission if the user cancels
      return;
    }
    
    try {
      const response = await api.post('/categories/create-category/', values);
      console.log('Category created successfully', response);
      navigate('/categories/', {state:{message: 'Category created sucessfully', type: 'success'}})
a    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        setErrors(backendErrors); // Set errors from the backend
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <FormComponent
      schema={createCategorySchema}
      onSubmit={handleSubmit}
      fields={fields}
    />
  );
};

export default CreateCategoryForm;
