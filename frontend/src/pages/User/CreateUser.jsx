import * as Yup from "yup";
import FormComponent from "../../components/UI/FormComponent";
import api from "../../api";
import { useNavigate } from 'react-router-dom';
const CreateUserForm = () => {
  const navigate = useNavigate();
  const createUserSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .max(150)
      .min(3),
    first_name: Yup.string()
      .required("First name is required")
      .max(150)
      .min(3),
    last_name: Yup.string()
      .required("Last name is required")
      .max(150)
      .min(3),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password1: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one digit'),
    password2: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password1")], "Passwords must match"),
    is_superuser: Yup.boolean(),
  });

  const fields = [
    { name: "username", type: "text", label: "Username" },
    { name: "first_name", type: "text", label: "First Name" },
    { name: "last_name", type: "text", label: "Last Name" },
    { name: "email", type: "email", label: "Email" },
    { name: "password1", type: "password", label: "Password" },
    { name: "password2", type: "password", label: "Confirm Password" },
    { name: "is_superuser", type: "checkbox", label: "Admin" },
  ];

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Add a confirmation prompt before proceeding with submission
    const confirmSubmission = window.confirm(
      "Are you sure you want to create a new user?"
    );
  
    if (!confirmSubmission) {
      setSubmitting(false); // Stop the submission if the user cancels
      return;
    }
  
    try {
      const response = await api.post("/users/create-user/", values);
      console.log("User created successfully", response);
      navigate('/users/')
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        setErrors(backendErrors); // Set the errors in Formik to display them on the form fields
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormComponent
      schema={createUserSchema}
      onSubmit={handleSubmit}
      fields={fields}
    />
  );
};

export default CreateUserForm;
