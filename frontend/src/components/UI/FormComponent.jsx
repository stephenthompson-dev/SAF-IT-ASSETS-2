import { Formik, Form, Field } from "formik";
import CustomField from "./CustomField"; // Assuming your custom input fields are here
import SearchableSelect from "./SearchableSelect";

const FormComponent = ({ schema, onSubmit, fields }) => {
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : ""; // Default for checkboxes
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className="w-full max-w-md p-8 bg-slate-600 text-white rounded-lg shadow-lg">
            {fields.map((field, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  field.type === "checkbox" ? "flex items-center" : ""
                }`}
              >
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
                  <label className="block text-sm text-slate-200">
                    {field.label}
                    <SearchableSelect
                      options={field.options}
                      placeholder={field.placeholder || "Select..."}
                      onChange={(value) => setFieldValue(field.name, value)} // Send the selected ID
                      value={values[field.name]} // Pass the current selected value
                    />

                    {errors[field.name] && touched[field.name] && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </div>
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
