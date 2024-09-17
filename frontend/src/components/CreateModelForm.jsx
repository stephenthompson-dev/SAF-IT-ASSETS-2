import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CreateModelForm = ({ apiUrl, modelName }) => {
  const [formData, setFormData] = useState({
    name: "", // Assuming a name field exists
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post(`${apiUrl}/${modelName}/`, formData)
      .then((response) => {
        navigate(`/${modelName}/${response.data.id}`); // Redirect to the details page of the newly created item
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter Name"
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter Description"
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateModelForm;
