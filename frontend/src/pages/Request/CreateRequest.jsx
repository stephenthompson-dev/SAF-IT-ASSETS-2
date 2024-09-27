import { useState, useEffect } from "react";
import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api"; 

const CreateRequestForm = () => {
  const [requests, setRequests] = useState([]);

  const createRequestSchema = Yup.object().shape({
    asset: Yup.string().required("Asset is required"),
    for_date: Yup.date().required("For date is required"),
    end_date: Yup.date(), 
    further_notice: Yup.boolean().default = false, //If true should disable the end_date, need to work on this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  });


  const [fields, setFields] = useState([
    { name: "asset", type: "select", label: "Asset", options: [], placeholder:"Select an asset" },
    { name: "for_date", type: "date", label: "For Date" },
    { name: "end_date", type: "date", label: "End Date"},
    { name: "further_notice", type: "checkbox", label: "Until Further Notice. "},
  ]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/requests/create-request/', values);
      console.log('Request created successfully', response);
      // 
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
    const fetchAssets = async () => {
      try {
        const response = await api.get("/assets/"); // Fetch categories
        const assetOptions = response.data.map((asset) => ({
          value: asset.id,
          label: asset.asset_name, // Adjust based on API response
        }));
  
        // Update the fields to include the fetched category options
        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === "asset"
              ? { ...field, options: assetOptions }
              : field
          )
        );
  
        // Set categories
        setAssets(assetOptions);
        // Log the fetched categories
        console.log('Fetched Assets:', assetOptions);
        
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      }
    };
  
    fetchAssets();
  }, []);

  return (
    <FormComponent
      schema={createRequestSchema}
      onSubmit={handleSubmit}
      fields={fields} // Pass the fields with updated category options
    />
  );
};

export default CreateRequestForm;
