import { useState } from "react";
import { PlusIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";


const Table = ({ columns, data, onCreate, onDelete, onUpdate }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDetails = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true); // Open the drawer
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null); // Clear selected row on close
  };

  const handleSave = (updatedRow) => {
    // Update the row in the data array (you could call an API to save the data)
    onUpdate(updatedRow); // Call onUpdate to handle saving the updated row
    setDrawerOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Table Title</h2>
        <button
          onClick={onCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> {/* Icon for Create */}
          Create New
        </button>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[column.accessor]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button
                  onClick={() => handleDetails(row)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <EyeIcon className="h-5 w-5" /> {/* Icon for Details */}
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" /> {/* Icon for Delete */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
