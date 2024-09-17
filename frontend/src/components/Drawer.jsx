import {useState, useEffect} from "react"

const Drawer = ({ isOpen, onClose, content, onSave }) => {
    const [formData, setFormData] = useState(content || {});
  
    // Update form data when the content changes (i.e., when a new row is selected)
    useEffect(() => {
      setFormData(content || {});
    }, [content]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSave = () => {
      onSave(formData); // Call the onSave handler to pass the updated data
      onClose(); // Close the drawer after saving
    };
  
    return (
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Details</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          {content && (
            <form className="space-y-4">
              {Object.keys(content).map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              ))}
            </form>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  };
  
  export default Drawer;