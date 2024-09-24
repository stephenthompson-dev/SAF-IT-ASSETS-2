import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api";
import { useEffect, useState } from "react";

const CreateCategoryForm = () => {
  const [categories, setCategories] = useState([]);

  const createCategorySchema = Yup.object().shape({
    category_name: Yup.string().required("Category Name is required").max(150),
  });

  const fields = [
    { name: "category_name", type: "text", label: "Category Name" },
  ];

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/categories/create-category/', values);
      console.log('Category created successfully', response);
      // Perform any action after a successful submission, e.g., redirect to a new page
    } catch (error) {
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
