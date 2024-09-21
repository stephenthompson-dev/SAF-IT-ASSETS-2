import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import api from "../../api";

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
    isAdmin: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post("endpoint", {
        params: values,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      validationSchema={createUserSchema}
      initialValues={{
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password1: "",
        password2: "",
        isAdmin: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="max-w-lg mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-slate-200">
              Username
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.username && touched.username ? "border-red-500" : "border-slate-600"
              }`}
              id="username"
              name="username"
              type="text"
            />
            <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email && touched.email ? "border-red-500" : "border-slate-600"
              }`}
              id="email"
              name="email"
              type="email"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-slate-200">
              First Name
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.first_name && touched.first_name ? "border-red-500" : "border-slate-600"
              }`}
              id="first_name"
              name="first_name"
              type="text"
            />
            <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-slate-200">
              Last Name
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.last_name && touched.last_name ? "border-red-500" : "border-slate-600"
              }`}
              id="last_name"
              name="last_name"
              type="text"
            />
            <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="password1" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password1 && touched.password1 ? "border-red-500" : "border-slate-600"
              }`}
              id="password1"
              name="password1"
              type="password"
            />
            <ErrorMessage name="password1" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="password2" className="block text-sm font-medium text-slate-200">
              Confirm Password
            </label>
            <Field
              className={`mt-1 block w-full px-3 py-2 bg-slate-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password2 && touched.password2 ? "border-red-500" : "border-slate-600"
              }`}
              id="password2"
              name="password2"
              type="password"
            />
            <ErrorMessage name="password2" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mb-4">
            <label htmlFor="isAdmin" className="inline-flex items-center text-sm font-medium text-slate-200">
              <Field id="isAdmin" name="isAdmin" type="checkbox" className="h-4 w-4 text-indigo-600" />
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
  );
};

export default CreateUser;
