import { useState, useEffect } from "react";
import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api"; // Ensure your API utility is imported

const CreateAssetForm = () => {
  const [categories, setCategories] = useState([]);

  // Yup schema for form validation
  const createAssetSchema = Yup.object().shape({
    asset_name: Yup.string().required("Asset name is required").max(150),
    purchase_date: Yup.string().required("Purchase date is required").max(150),
    category: Yup.string().required("Category is required"),
  });

  // Initial field structure
  const [fields, setFields] = useState([
    { name: "asset_name", type: "text", label: "Asset Name" },
    { name: "purchase_date", type: "date", label: "Purchase Date" },
    { name: "category", type: "select", label: "Category", options: [] },
  ]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/assets/create-asset/', values);
      console.log('Asset created successfully', response);
      // Perform any action after a successful submission, e.g., redirect to a new page
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        // Set the errors in Formik to display them on the form fields
        setErrors(backendErrors);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch categories from the API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/"); // Fetch categories
        const categoryOptions = response.data.map((category) => ({
          value: category.id,
          label: category.category_name, // Adjust based on API response
        }));
  
        // Update the fields to include the fetched category options
        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === "category"
              ? { ...field, options: categoryOptions }
              : field
          )
        );
  
        // Set categories
        setCategories(categoryOptions);
        // Log the fetched categories
        console.log('Fetched Categories:', categoryOptions);
        
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
  
    fetchCategories();
  }, []);

  return (
    <FormComponent
      schema={createAssetSchema}
      onSubmit={handleSubmit}
      fields={fields} // Pass the fields with updated category options
    />
  );
};

export default CreateAssetForm;
