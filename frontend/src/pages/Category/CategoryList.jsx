import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';
import DisplayMessage from '../../components/UI/DisplayMessage';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Message handling
    const location = useLocation();
    const [message, setMessage] = useState(null);

    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "Category", accessor: "category_name" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/categories/");
                setCategories(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Message display
    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage({ text: location.state.message, type: location.state.type });
        }
    }, [location.state]);

    const handleMessageClose = () => {
        setMessage(null);
        // Optionally navigate to clear the state
        navigate('/categories', { replace: true });
    };

    const handleCreate = () => {
        navigate("/create-category");
    };

    const handleEdit = (selectedRow) => {
        navigate(`/categories/${selectedRow.id}/edit`);
    };

    const handleDelete = async (selectedRow) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${selectedRow.id}/`);
                setCategories(prevCategories => prevCategories.filter(category => category.id !== selectedRow.id));
                console.log("Category deleted successfully");
            } catch (error) {
                console.error("Failed to delete category:", error);
                setError("Failed to delete category.");
            }
        }
    };

    if (loading) {
        return <LoadingIndicator />; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }

    return (
        <>
          <div>
            {message && (
              <DisplayMessage
                message={message.text}
                type={message.type}
                onClose={handleMessageClose}
              />
            )}
          </div>
          <div>
            <Table
              title="Categories"
              columns={columns}
              data={categories}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
      );
};

export default Categories;
