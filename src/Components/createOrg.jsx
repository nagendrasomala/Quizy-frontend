import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../assets/api';

const CreateOrganization = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    secretKey: ''
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    const superadminToken = localStorage.getItem('super_admin_token'); 

    try {
      const response = await api.post(
        '/superAdmin/map-org-adm', 
        formData,
        {
          headers: {
            Authorization: `Bearer ${superadminToken}`, 
          },
        }
      );

      toast.success("Organization and Admin created Successfully."); 
      setFormData({
        organizationName: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        secretKey: ''
      }); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage); 
    }
  };

  return (
    <div className=' flex flex-col justify-center items-center mt-5'>
      <h2 className="text-2xl font-bold mb-4">Create Organization</h2>

      <form onSubmit={handleCreate} className='bg-white border mt-2 w-4/12 p-3 flex flex-col justify-center'>
        <input
          type="text"
          placeholder="Organization Name"
          className="border p-2 mb-2 w-full rounded-md mr-2"
          value={formData.organizationName}
          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Admin Name"
          className="border p-2 mb-2 w-full rounded-md mr-2"
          value={formData.adminName}
          onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Admin Email"
          className="border p-2 mb-2 w-full rounded-md mr-2"
          value={formData.adminEmail}
          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          className="border p-2 mb-2 w-full rounded-md mr-2"
          value={formData.adminPassword}
          onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Secret Key"
          className="border p-2 mb-2 w-full rounded-md mr-2"
          value={formData.secretKey}
          onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
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
