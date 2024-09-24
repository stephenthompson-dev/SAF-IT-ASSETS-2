import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "Asset Name", accessor: "asset_name" },
        { Header: "Purchase Date", accessor: "purchase_date" },
        { Header: "Category", accessor: "category_name" }, // Will use this after mapping
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetsResponse, categoriesResponse] = await Promise.all([
                    api.get("/assets/"),
                    api.get("/categories/"),
                ]);
                
                const fetchedAssets = assetsResponse.data.map(asset => {
                    // Find the category name based on the category_id
                    const category = categoriesResponse.data.find(cat => cat.id === asset.category);
                    return {
                        ...asset,
                        category_name: category ? category.category_name : "Unknown", // Add category name to asset
                    };
                });

                setAssets(fetchedAssets);
                setCategories(categoriesResponse.data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, []);

    const handleCreate = () => {
        navigate("/create-asset", { state: { categories } });
    };

    const handleUpdate = async (updatedAsset) => {
        try {
            const response = await api.put(`/api/assets/${updatedAsset.id}/`, updatedAsset); 
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
        return <LoadingIndicator />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Table
                title="Assets"
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

export default Assets;
