import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Requests = () => {
    const [requests, setRequests] = useState([]); // State to store request data
    const [assets, setAssets] = useState([]); // State to store asset data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate(); 

    // Define the columns for the table
    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "User", accessor: "user" }, // Accessing username field from user object
        { Header: "Asset", accessor: "asset_name" }, // Asset name will be mapped later
        { Header: "For Date", accessor: "for_date" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsResponse, assetsResponse] = await Promise.all([
                    api.get("/requests/"),
                    api.get("/assets/"), // Fetch assets data
                ]);
                
                const fetchedRequests = requestsResponse.data.map(request => {
                    // Find the asset name based on the asset id
                    const asset = assetsResponse.data.find(asset => asset.id === request.asset);
                    return {
                        ...request,
                        asset_name: asset ? asset.asset_name : "Unknown", // Add asset name to request
                    };
                });

                setRequests(fetchedRequests); // Set the fetched requests with asset names
                setAssets(assetsResponse.data); // Set the fetched assets
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchData(); // Call the fetch function
    }, []);

    const handleCreate = () => {
        navigate("/create-request"); // Navigate to the create request form
    };

    const handleUpdate = async (updatedRequest) => {
        try {
            const response = await api.put(`/api/requests/${updatedRequest.id}/`, updatedRequest); // Update request on the server
            console.log("Updated request:", response.data);
            setRequests((prevRequests) =>
                prevRequests.map((request) => (request.id === updatedRequest.id ? updatedRequest : request))
            );
        } catch (error) {
            console.error("Failed to update request:", error);
        }
    };

    const handleDetails = (row) => {
        console.log("View details for:", row);
    };

    const handleDelete = (row) => {
        console.log("Delete request:", row);
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
                title="Requests"
                columns={columns}
                data={requests}
                onCreate={handleCreate}
                onDetails={handleDetails}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </div>
    );
};

export default Requests;
