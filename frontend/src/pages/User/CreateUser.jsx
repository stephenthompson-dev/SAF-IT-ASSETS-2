import CreateModelForm from "../../components/CreateModelForm";

const CreateUser = () => {
  return (
    <div>
      <h1>Create New User</h1>
      <CreateModelForm apiUrl="/api/user" modelName="user" />
    </div>
  );
};

export default CreateUser;
