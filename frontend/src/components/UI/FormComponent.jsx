import { Formik, Form, Field } from "formik";
import CustomField from "./CustomField"; // Assuming your custom input fields are here
import SearchableSelect from "./SearchableSelect";
import PropTypes from 'prop-types'; // For prop type validation (optional but recommended)

/**
 * FormComponent renders a dynamic form based on provided fields.
 * @param {object} props - The component props.
 * @param {object} props.schema - Yup validation schema.
 * @param {function} props.onSubmit - Form submission handler.
 * @param {Array} props.fields - Array of field definitions.
 * @param {string} [props.title] - Optional title for the form.
 */
const FormComponent = ({ schema, onSubmit, fields, title }) => {
  // Initialize form values based on fields
  const initialValues = fields.reduce((acc, field) => {
    if (field.readOnly) {
      acc[field.name] = field.value || ""; // Default value for read-only fields
    } else {
      acc[field.name] = field.type === "checkbox" ? false : ""; // Default for checkboxes and other fields
    }
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize // Allows the form to reinitialize when initialValues change
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className="w-full max-w-md p-8 bg-slate-600 text-white rounded-lg shadow-lg">
            {/* Render the title if provided */}
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            
            {/* Render each field dynamically */}
            {fields.map((field, index) => {
              // Determine if the field should be read-only
              const isReadOnly =
                field.readOnly ||
                (field.name === 'end_date' && values.further_notice); // Example condition

              return (
                <div
                  key={index}
                  className={`mb-4 ${field.type === "checkbox" ? "flex items-center" : ""}`}
                >
                  {field.type === "checkbox" ? (
                    // Handle checkbox fields
                    <label className="inline-flex items-center text-sm font-medium text-slate-200">
                      <Field
                        name={field.name}
                        type={field.type}
                        className="h-4 w-4 text-indigo-600 bg-slate-500 rounded hover:bg-indigo-400"
                        disabled={isReadOnly} // Disable if read-only
                      />
                      <span className="ml-2">{field.label}</span>
                    </label>
                  ) : field.type === "select" ? (
                    // Handle select fields
                    <label className="block text-sm text-slate-200">
                      {field.label}
                      <SearchableSelect
                        options={field.options}
                        placeholder={field.placeholder || "Select..."}
                        onChange={(value) => setFieldValue(field.name, value)} // Send the selected value
                        value={values[field.name]} // Pass the current selected value
                        isDisabled={isReadOnly} // Disable if read-only
                      />

                      {errors[field.name] && touched[field.name] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[field.name]}
                        </div>
                      )}
                    </label>
                  ) : field.type === "text" ||
                    field.type === "date" ||
                    field.type === "number" ||
                    field.type === "email" ||
                    field.type === "password" ? (
                    // Handle text-like input fields
                    <label className="block text-sm text-slate-200">
                      {field.label}
                      <Field
                        name={field.name}
                        type={field.type}
                        readOnly={isReadOnly}
                        className={`mt-1 block w-full px-3 py-2 ${
                          isReadOnly ? "bg-gray-200 cursor-not-allowed" : "bg-slate-500"
                        } text-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors[field.name] && touched[field.name] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[field.name]}
                        </div>
                      )}
                    </label>
                  ) : (
                    // Handle other field types using CustomField
                    <CustomField
                      fieldName={field.name}
                      type={field.type}
                      errors={errors}
                      touched={touched}
                      text={field.label}
                      readOnly={isReadOnly} // Pass readOnly prop to CustomField
                    />
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Optional: Define prop types for better type checking
FormComponent.propTypes = {
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.array, // For select fields
      placeholder: PropTypes.string, // For select fields
      readOnly: PropTypes.bool, // If the field is read-only
      value: PropTypes.any, // Default value for read-only fields
    })
  ).isRequired,
  title: PropTypes.string, // Optional title
};

export default FormComponent;
