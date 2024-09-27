import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import Table from '../../components/UI/Table';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

const Requests = () => {
    const [requests, setRequests] = useState([]); // State to store request data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate(); 

    // Define the columns for the table
    const columns = [
        { Header: "ID", accessor: "id" },
        { Header: "User", accessor: "user" },
        { Header: "Asset", accessor: "asset_name" },
        { Header: "For Date", accessor: "for_date" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsResponse, usersResponse, assetsResponse] = await Promise.all([
                    api.get("/requests/"),
                    api.get("/users/"),
                    api.get("/assets/"),
                ]);

                // Create a mapping of users and assets for easy lookup
                const usersMap = {};
                usersResponse.data.forEach(user => {
                    usersMap[user.id] = user.username;
                });

                const assetsMap = {};
                assetsResponse.data.forEach(asset => {
                    assetsMap[asset.id] = asset.asset_name;
                });

                // Map over the requests to add user and asset names
                const fetchedRequests = requestsResponse.data.map(request => ({
                    ...request,
                    user_name: usersMap[request.user] || "Unknown",
                    asset_name: assetsMap[request.asset] || "Unknown",
                }));

                setRequests(fetchedRequests); // Set the fetched requests with user and asset names
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

    const handleEdit = (selectedRow) => {
        navigate(`/requests/${selectedRow.id}/edit`);
    };

    const handleDelete = async (selectedRow) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/requests/${selectedRow.id}/`);
                setRequests(prevRequests => prevRequests.filter(request => request.id !== selectedRow.id));
                console.log("Request deleted successfully");
            } catch (error) {
                console.error("Failed to delete request:", error);
                setError("Failed to delete request.");
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
        <div>
            <Table
                title="Requests"
                columns={columns}
                data={requests}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Requests;
