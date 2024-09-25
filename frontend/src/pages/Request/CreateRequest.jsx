import { useState, useEffect } from "react";
import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const CreateRequestForm = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [furtherNotice, setFurtherNotice] = useState(false); // Track checkbox state
  const [formValues, setFormValues] = useState({
    asset: "",
    for_date: "",
    end_date: "",
    further_notice: false,
  });

  // Yup schema for form validation
  const createRequestSchema = Yup.object().shape({
    asset: Yup.string().required("Asset is required"),
    for_date: Yup.date().required("For date is required"),
    end_date: Yup.date().when("further_notice", {
      is: false,
      then: Yup.date().required(
        "End date is required when further notice is not checked"
      ),
      otherwise: Yup.date().notRequired(), // Not required if further_notice is true
    }),
    further_notice: Yup.boolean(),
  });

  // Initial field structure
  const [fields, setFields] = useState([
    {
      name: "asset",
      type: "select",
      label: "Asset",
      options: [],
      placeholder: "Select an Asset",
    },
    { name: "for_date", type: "date", label: "For Date" },
    {
      name: "end_date",
      type: "date",
      label: "End Date",
      disabled: furtherNotice,
    }, // Control disabled state here
    { name: "further_notice", type: "checkbox", label: "Until Further Notice" },
  ]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const confirmSubmission = window.confirm(
      "Are you sure you want to create a request?"
    );

    if (!confirmSubmission) {
      setSubmitting(false); // Stop the submission if the user cancels
      return;
    }

    try {
      const response = await api.post("/assets/create-request/", values);
      console.log("Asset created successfully", response);
      navigate('/requests/')
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        setErrors(backendErrors);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch categories from the API on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get("/assets/");
        const assetOptions = response.data.map((asset) => ({
          value: asset.id,
          label: asset.asset_name,
        }));

        setFields((prevFields) =>
          prevFields.map((field) =>
            field.name === "asset" ? { ...field, options: assetOptions } : field
          )
        );

        setAssets(assetOptions);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      }
    };

    fetchAssets();
  }, []);

  // Handle further notice checkbox change
  const handleFurtherNoticeChange = (event) => {
    const isChecked = event.target.checked;
    setFurtherNotice(isChecked);

    // Clear the end_date field and update its disabled state
    if (isChecked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        end_date: "", // Clear the value
        further_notice: isChecked,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        further_notice: isChecked,
      }));
    }

    // Update end_date field's disabled state
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.name === "end_date"
          ? { ...field, disabled: isChecked } // Disable end_date field based on further notice
          : field
      )
    );
  };

  // Handle change for other fields
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <FormComponent
      schema={createRequestSchema}
      onSubmit={handleSubmit}
      fields={fields.map((field) => ({
        ...field,
        onChange:
          field.name === "further_notice"
            ? handleFurtherNoticeChange
            : handleFieldChange,
        value: formValues[field.name], // Bind field value
      }))}
    />
  );
};

export default CreateRequestForm;
