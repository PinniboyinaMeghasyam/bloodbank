import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    donorName: '',
    donorBloodGroup: '',
    donorContact: '',
    donorSelect: '',
    donationQty: ''
  });

  // Fetch donors and inventory on component mount
  useEffect(() => {
    fetchDonors();
    fetchInventory();
  }, []);

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/donors');
      const data = await response.json();
      setDonors(data);
      updateDonorSelect(data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Update donor select options
  const updateDonorSelect = (donorsData) => {
    const donorSelect = document.getElementById('donorSelect');
    if (donorSelect) {
      donorSelect.innerHTML = '<option value="">Select donor</option>';
      donorsData.forEach((donor, index) => {
        const option = document.createElement('option');
        option.value = donor._id;
        option.textContent = `${donor.name} (${donor.bloodGroup})`;
        donorSelect.appendChild(option);
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Register a new donor
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.donorName,
          bloodGroup: formData.donorBloodGroup,
          contact: formData.donorContact
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Donor ${formData.donorName} registered!`);
        setFormData({
          ...formData,
          donorName: '',
          donorBloodGroup: '',
          donorContact: ''
        });
        fetchDonors();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering donor:', error);
      alert('Error registering donor');
    }
  };

  // Add blood donation
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/inventory/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorId: formData.donorSelect,
          quantity: parseInt(formData.donationQty)
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
          ...formData,
          donorSelect: '',
          donationQty: ''
        });
        fetchInventory();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Error adding donation');
    }
  };

  return (
    <div className="container">
      <h2>Blood Bank Management System</h2>

      <h3>Register Donor</h3>
      <form id="donorForm" onSubmit={handleDonorSubmit}>
        <label htmlFor="donorName">Name:</label>
        <input 
          type="text" 
          id="donorName" 
          value={formData.donorName}
          onChange={handleInputChange}
          required 
          placeholder="e.g., John Doe" 
        />

        <label htmlFor="donorBloodGroup">Blood Group:</label>
        <select 
          id="donorBloodGroup" 
          value={formData.donorBloodGroup}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        
        <label htmlFor="donorContact">Contact:</label>
        <input 
          type="text" 
          id="donorContact" 
          value={formData.donorContact}
          onChange={handleInputChange}
          required 
          placeholder="e.g., 555-1234"
        />
        
        <button type="submit">Register Donor</button>
      </form>

      <h3>Add Blood Donation</h3>
      <form id="donationForm" onSubmit={handleDonationSubmit}>
        <label htmlFor="donorSelect">Donor Name:</label>
        <select 
          id="donorSelect" 
          value={formData.donorSelect}
          onChange={handleInputChange}
          required
        >
          <option value="">Select donor</option>
          {donors.map((donor) => (
            <option key={donor._id} value={donor._id}>
              {donor.name} ({donor.bloodGroup})
            </option>
          ))}
        </select>
        
        <label htmlFor="donationQty">Quantity (units):</label>
        <input 
          type="number" 
          id="donationQty" 
          value={formData.donationQty}
          onChange={handleInputChange}
          min="1" 
          required 
          placeholder="e.g., 1"
        />
        
        <button type="submit">Add Donation</button>
      </form>

      <h3>Current Blood Inventory</h3>
      <table>
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Quantity (units)</th>
          </tr>
        </thead>
        <tbody id="inventoryTableBody">
          {inventory.map((item) => (
            <tr key={item.bloodGroup}>
              <td>{item.bloodGroup}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;