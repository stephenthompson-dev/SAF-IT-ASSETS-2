import { Field as FormikField, ErrorMessage } from "formik";

const CustomField = ({ fieldName, type, errors = {}, touched = {}, text }) => {
  return (
    <div className="mb-4">
      <label htmlFor={fieldName} className="block text-sm font-medium text-slate-200">
        {text} 
      </label>
      <FormikField
        className={`mt-1 block w-full px-3 py-2 bg-slate-500 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[fieldName] && touched[fieldName] ? "border-red-500" : "border-slate-600"
        }`}
        id={fieldName}
        name={fieldName}
        type={type}
      />
      <ErrorMessage name={fieldName} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
};

export default CustomField;
