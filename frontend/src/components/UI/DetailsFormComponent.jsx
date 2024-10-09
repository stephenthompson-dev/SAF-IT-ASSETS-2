import { Formik, Form } from 'formik';

const DetailsFormComponent = ({ schema, onSubmit, fields, initialValues, title }) => {
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
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            {fields.map((field, index) => {
              // Determine if the field should be read-only
              const isReadOnly = field.readOnly;

              return (
                <div
                  key={index}
                  className={`mb-4 ${field.type === 'checkbox' ? 'flex items-center' : ''}`}
                >
                  {field.type === 'select' ? (
                    // Handle select fields
                    <label className="block text-sm text-slate-200">
                      {field.label}
                      <select
                        name={field.name}
                        className="mt-1 block w-full px-3 py-2 bg-slate-500 text-white rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                        value={values[field.name]}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="">{field.placeholder || 'Select...'}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[field.name] && touched[field.name] && (
                        <div className="text-red-500 text-xs mt-1">{errors[field.name]}</div>
                      )}
                    </label>
                  ) : field.type === 'checkbox' ? (
                    // Handle checkbox fields
                    <label className="inline-flex items-center text-sm font-medium text-slate-200">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={values[field.name]}
                        onChange={(e) => setFieldValue(field.name, e.target.checked)}
                        className="h-4 w-4 text-slate-500 bg-slate-300 rounded hover:bg-indigo-400"
                      />
                      <span className="ml-2">{field.label}</span>
                    </label>
                  ) : field.type === 'text' ||
                    field.type === 'date' ||
                    field.type === 'number' ||
                    field.type === 'email' ||
                    field.type === 'password' ? (
                    // Handle text-like input fields
                    <label className="block text-sm text-slate-200">
                      {field.label}
                      <input
                        name={field.name}
                        type={field.type}
                        value={values[field.name] || ''}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                        readOnly={isReadOnly}
                        className={`mt-1 block w-full px-3 py-2 ${
                          isReadOnly ? 'bg-slate-400' : 'bg-slate-500'
                        } text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors[field.name] && touched[field.name] && (
                        <div className="text-red-500 text-xs mt-1">{errors[field.name]}</div>
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
                      readOnly={isReadOnly}
                    />
                  )}
                </div>
              );
            })}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DetailsFormComponent;