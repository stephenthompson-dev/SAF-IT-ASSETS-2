import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';


const Categories = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "Category", accessor: "category_name" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/categories/");
                console.log(response.data);
                setAssets(response.data); 
                setLoading(false); 
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData(); // Call the fetch function
    }, []);

    const handleCreate = () => {
        navigate("/create-category");
    };

    const handleUpdate = async (updatedAsset) => {
        try {
            const response = await api.put(`/api/category/${updatedAsset.id}/`, updatedAsset); 
            console.log("Updated asset:", response.data);
            
            setAssets((prevAssets) =>
                prevAssets.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset))
            );
        } catch (error) {
            console.error("Failed to update asset:", error);
        }
    };

    const handleDetails = (row) => {
        console.log("View details for:", row);
    };

    const handleDelete = (row) => {
        console.log("Delete asset:", row);
    };

    if (loading) {
        return <LoadingIndicator />; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }

    return (
        <div>
            <Table
                title="Categories"
                columns={columns}
                data={assets}
                onCreate={handleCreate}
                onDetails={handleDetails}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>
    );
};
export default Categories;