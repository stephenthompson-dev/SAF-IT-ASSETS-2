// userFormConfig.js

export const userFormFields = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'last_name', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password1', label: 'Password', type: 'password' },
    { name: 'password2', label: 'Confirm Password', type: 'password' },
    { name: 'is_staff', label: 'Is Admin', type: 'checkbox' },
  ];
  
  export const initialUserValues = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password1: '',
    password2: '',
    is_staff: false,
  };
  