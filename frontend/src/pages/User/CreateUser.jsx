import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import api from "../../api";
import CustomField from "../../components/UI/CustomField";

const CreateUser = () => {
  const createUserSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .max(150, "Username must be 150 characters or less"),
    first_name: Yup.string()
      .required("First name is required")
      .max(150, "First name must be 150 characters or less"),
    last_name: Yup.string()
      .required("Last name is required")
      .max(150, "Last name must be 150 characters or less"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        "Invalid email address"
      ),
    password1: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    password2: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password1")], "Passwords must match"),
    is_superuser: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await api.post('/users/create-user/', values);
      console.log('User created successfully', response);
      // Perform any action after a successful submission
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

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <Formik
        validationSchema={createUserSchema}
        initialValues={{
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password1: "",
          password2: "",
          is_superuser: false,
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full max-w-md p-8 bg-slate-600 text-white rounded-lg shadow-lg">
            <CustomField fieldName="username" type="text" errors={errors} touched={touched} text="Username" />
            <CustomField fieldName="email" type="email" errors={errors} touched={touched} text="Email" />
            <CustomField fieldName="first_name" type="text" errors={errors} touched={touched} text="First Name" />
            <CustomField fieldName="last_name" type="text" errors={errors} touched={touched} text="Last Name" />
            <CustomField fieldName="password1" type="password" errors={errors} touched={touched} text="Password" />
            <CustomField fieldName="password2" type="password" errors={errors} touched={touched} text="Confirm Password" />
            <div className="mb-4">
              <label htmlFor="is_superuser" className="inline-flex items-center text-sm font-medium text-slate-200">
                <Field id="is_superuser" name="is_superuser" type="checkbox" className="h-4 w-4 text-indigo-600 bg-slate-500 hover:bg-indigo-400" />
                <span className="ml-2">Admin</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );

};

export default CreateUser;
