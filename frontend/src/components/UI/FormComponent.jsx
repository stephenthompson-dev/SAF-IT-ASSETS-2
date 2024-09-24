import { Formik, Form, Field } from "formik";
import CustomField from "./CustomField"; // Assuming your custom input fields are here

const FormComponent = ({ schema, onSubmit, fields }) => {
  // Create initial values as empty strings or other defaults
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = ""; // Assign empty string for each field, except for checkboxes
    if (field.type === "checkbox") {
      acc[field.name] = false; // Default value for checkboxes
    }
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="w-full max-w-md p-8 bg-slate-600 text-white rounded-lg shadow-lg">
            {fields.map((field, index) => (
              <div key={index} className={`mb-4 ${field.type === 'checkbox' ? 'flex items-center' : ''}`}>
                {field.type === "checkbox" ? (
                  <label className="inline-flex items-center text-sm font-medium text-slate-200">
                    <Field
                      name={field.name}
                      type={field.type}
                      className="h-4 w-4 text-indigo-600 bg-slate-500 rounded hover:bg-indigo-400"
                    />
                    <span className="ml-2">{field.label}</span>
                  </label>
                ) : field.type === "select" ? (
                  <label className="block text-sm font-medium text-slate-200">
                    {field.label}
                    <Field
                      name={field.name}
                      as="select"
                      className="mt-1 block w-full bg-slate-500 text-white border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" label="Select a category" />
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value} label={option.label} />
                      ))}
                    </Field>
                    {errors[field.name] && touched[field.name] && (
                      <div className="text-red-500 text-xs mt-1">{errors[field.name]}</div>
                    )}
                  </label>
                ) : (
                  <CustomField
                    fieldName={field.name}
                    type={field.type}
                    errors={errors}
                    touched={touched}
                    text={field.label}
                  />
                )}
              </div>
            ))}
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

export default FormComponent;
