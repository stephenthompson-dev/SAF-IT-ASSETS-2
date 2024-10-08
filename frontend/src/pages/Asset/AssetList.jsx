// src/components/AssetList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Asset Name", accessor: "asset_name" },
    { Header: "Purchase Date", accessor: "purchase_date" },
    { Header: "Category", accessor: "category_name" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, categoriesResponse] = await Promise.all([
          api.get("/assets/"),
          api.get("/categories/"),
        ]);

        const fetchedAssets = assetsResponse.data.map(asset => {
          const category = categoriesResponse.data.find(cat => cat.id === asset.category);
          return {
            ...asset,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setAssets(fetchedAssets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    navigate("/assets/create");
  };

  const handleEdit = (selectedRow) => {
    navigate(`/assets/edit/${selectedRow.id}/edit`);
  };

  const handleDelete = async (selectedRow) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${selectedRow.id}/`);
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== selectedRow.id));
        console.log("Asset deleted successfully");
      } catch (error) {
        console.error("Failed to delete asset:", error);
        setError("Failed to delete asset.");
      }
    }
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Assets;
