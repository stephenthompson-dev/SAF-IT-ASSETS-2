import { PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const Table = ({
  columns,
  data,
  onCreate,
  title,
  showCreateButton = true,
  onEdit,
  onDelete,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show the modal and start the animation
  useEffect(() => {
    if (selectedRow) {
      // Allow time for the modal to mount before starting the animation
      const timer = setTimeout(() => {
        setIsModalVisible(true);
      }, 10); // Small delay to ensure the modal is mounted

      return () => clearTimeout(timer); // Cleanup the timer if component unmounts
    }
  }, [selectedRow]);

  // Function to hide the modal with animation
  const closeModal = () => {
    setIsModalVisible(false);
    // Wait for the transition to complete before removing the modal from DOM
    setTimeout(() => {
      setSelectedRow(null);
    }, 300); // Match this duration with your transition duration
  };

  // Function to handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showCreateButton && (
          <button
            onClick={onCreate}
            className="flex items-center px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New
          </button>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Edit/Delete */}
      {selectedRow && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ${
            isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${
              isModalVisible ? 'scale-100' : 'scale-95'
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Select an action</h3>
            <div className="flex justify-around space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  onEdit(selectedRow);
                  closeModal();
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to delete this record?')
                  ) {
                    onDelete(selectedRow);
                  }
                  closeModal();
                }}
              >
                Delete
              </button>
            </div>
            <button
              className="mt-4 text-gray-600 underline"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
