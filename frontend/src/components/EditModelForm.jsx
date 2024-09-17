import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EditModelForm = ({ apiUrl, modelName }) => {
  const { id } = useParams(); // Get the model's ID from the route
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`${apiUrl}/${modelName}/${id}/`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, apiUrl, modelName]);

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
      .put(`${apiUrl}/${modelName}/${id}/`, formData)
      .then(() => {
        navigate(`/${modelName}/${id}`); // Redirect back to details page after updating
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditModelForm;
