import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../assets/api'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SOrganizationsPage = () => {
  const [organization, setOrganization] = useState(null); // Initialize as null for a single organization
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await api.get('/student/my-organizations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('student_token')}`,
          },
        });

        if (response.data && response.data.organization) {
          setOrganization(response.data.organization); // Set the single organization
        } else {
          toast.error('No organization found.');
        }
      } catch (error) {
        toast.error('Error fetching organization.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization(); // Call the async function to fetch data
  }, []);

  // Function to handle navigation to ClassesPage
  const handleNavigate = (orgName, orgId) => {
    navigate('/student-classes', {
      state: {
        organizationName: orgName,
        organizationId: orgId,
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My Organization</h1>

      {loading ? (
        <p>Loading organization...</p>
      ) : organization ? ( 
        <div
          className="mb-3 px-3 mt-5 flex border flex-row w-6/12 h-12 bg-white rounded-md shadow-md hover:bg-blue-300 cursor-pointer justify-between items-center"
          onClick={() => handleNavigate(organization.name, organization._id)} // Use organization here
        >
          <div className="w-full px-2">
            <div>
              {organization.name} ({organization.organizationId}) {/* Update the key as needed */}
            </div>
          </div>
        </div>
      ) : (
        <p>No organization found.</p>
      )}
    </div>
  );
};

export default SOrganizationsPage;
