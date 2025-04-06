import React, { useState } from 'react';
import { Send } from 'lucide-react';
import MobileNavbar from "../components/MobileNavbar.jsx";
import api from "../api";
import '../styles/ProductRequestForm.css';
import LeavesBackground from '../components/LeavesBackground.jsx';

const ProductRequestForm = () => {
  const initialFormState = {
    requestName: '',
    description: '',
    category: '',
    condition: 'Good',
    maxPrice: '',
    location: '',
    urgency: 'Medium'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPrice' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/requests/create/", {
        request_name: formData.requestName,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        max_price: formData.maxPrice,
        location: formData.location,
        urgency: formData.urgency
      });

      console.log('Product Request Submitted:', response.data);
      setSubmitSuccess(true);
      setFormData(initialFormState);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-request-form-container">
      <LeavesBackground/>

      <div className="form-wrapper">
        <h2 className="form-title">Create Product Request</h2>
        {submitSuccess && <div className="success-message">🎉 Request submitted successfully!</div>}

        <form onSubmit={handleSubmit} className="product-request-form-body">
          <div className="form-group">
            <label htmlFor="requestName">Product Name</label>
            <input
              type="text"
              id="requestName"
              name="requestName"
              value={formData.requestName}
              onChange={handleChange}
              required
              placeholder="e.g., Reusable Water Bottle"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the product you want..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Home">Home</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condition">Preferred Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxPrice">Maximum Price (₹)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Chennai, Trichy"
            />
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <MobileNavbar />
    </div>
  );
};

export default ProductRequestForm;