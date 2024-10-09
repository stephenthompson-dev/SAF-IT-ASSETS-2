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
  onApprove, // Add the onApprove prop
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      const timer = setTimeout(() => {
        setIsModalVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [selectedRow]);

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedRow(null);
    }, 300);
  };

  const handleRowClick = (row) => {
    if (onEdit || onDelete || onApprove) {
      setSelectedRow(row);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showCreateButton && onCreate && (
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

      {/* Modal for Edit/Delete/Approve */}
      {selectedRow && (onEdit || onDelete || onApprove) && (
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
              {onEdit && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => {
                    onEdit(selectedRow);
                    closeModal();
                  }}
                >
                  Edit
                </button>
              )}
              {onDelete && (
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
              )}
              {onApprove && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => {
                    onApprove(selectedRow);
                    closeModal();
                  }}
                >
                  Approve
                </button>
              )}
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