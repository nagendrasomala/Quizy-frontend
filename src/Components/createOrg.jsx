import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../assets/api';


const CreateOrganization = () => {
  const [newOrg, setNewOrg] = useState({ name: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem('admin_token'); // Get the admin token from localStorage

    try {
      const response = await api.post(
        '/admin/create-organization', 
        { name: newOrg.name },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Include the token in headers
          },
        }
      );

      toast.success(response.data.message); // Show success toast
      setNewOrg({ name: '' }); // Reset form
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage); // Show error toast
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create Organization</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Organization Name"
          className="border p-2 mb-2 w-4/12 rounded-md mr-2"
          value={newOrg.name}
          onChange={(e) => setNewOrg({ name: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 mt-4 rounded-md">
          Create
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default CreateOrganization;
