import React from 'react';
import Table from '../components/Table'; // Adjust the import path accordingly

const columns = [
  {
    Header: 'Name',
    accessor: 'name', // key in the data
  },
  {
    Header: 'Email',
    accessor: 'email', // key in the data
  },
  {
    Header: 'Role',
    accessor: 'role', // key in the data
  },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  // more data
];

const Home  = () => {
  return (
    <Table
      columns={columns}
      data={data}
      createUrl="/create"
      detailUrlPrefix="/details"
      editUrlPrefix="/edit"
    />
  );
};

export default Home;