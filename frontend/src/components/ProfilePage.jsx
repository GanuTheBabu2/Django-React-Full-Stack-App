// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, PlusCircle, Camera, X, Bell, BellOff } from 'lucide-react';
import '../styles/ProfilePage.css';
import api from "../api";
import MobileNavbar from "../components/MobileNavbar.jsx";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [greenInterests, setGreenInterests] = useState([]);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [newInterest, setNewInterest] = useState({
    category: 'Sustainable Clothing',
    productDescription: '',
    organization: '',
    costPerUnit: undefined,
    notificationsEnabled: true,
  });

  // Badge tiers (in tons of CO2 saved)
  const badges = [
    { name: "Eco Newbie", minCarbon: 0, maxCarbon: 0.5, color: '#d3e7d6' },
    { name: "Green Starter", minCarbon: 0.5, maxCarbon: 1, color: '#b7d2bd' },
    { name: "Eco Warrior", minCarbon: 1, maxCarbon: 2, color: '#5fa86f' },
    { name: "Planet Saver", minCarbon: 2, maxCarbon: 5, color: '#2f4936' },
    { name: "Climate Hero", minCarbon: 5, maxCarbon: Infinity, color: '#1a2e1f' },
  ];

  // Five different sample notifications (static)
  const sampleNotifications = [
    {
      category: 'Sustainable Clothing',
      productDescription: 'Organic Cotton T-Shirt',
      organization: 'Patagonia',
      costPerUnit: 25.99,
    },
    {
      category: 'Eco-Friendly Home Goods',
      productDescription: 'Bamboo Cutting Board',
      organization: 'Bambu',
      costPerUnit: 15.50,
    },
    {
      category: 'Recycled Electronics',
      productDescription: 'Refurbished Laptop',
      organization: 'Dell',
      costPerUnit: 499.99,
    },
    {
      category: 'Sustainable Packaging',
      productDescription: 'Compostable Mailers',
      organization: 'EcoEnclose',
      costPerUnit: 0.75,
    },
    {
      category: 'Upcycled Furniture',
      productDescription: 'Reclaimed Wood Coffee Table',
      organization: 'West Elm',
      costPerUnit: 299.00,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/user/profile/');
        setUser(response.data);
        setGreenInterests([]); // Replace with backend data if available
      } catch (error) {
        console.error('Failed to fetch user profile:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const greenInterestOptions = [
    'Sustainable Clothing',
    'Eco-Friendly Home Goods',
    'Recycled Electronics',
    'Sustainable Packaging',
    'Upcycled Furniture',
    'Green Accessories',
    'Other',
  ];

  const handleNewInterestChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setNewInterest({ ...newInterest, [name]: e.target.checked });
    } else {
      setNewInterest({
        ...newInterest,
        [name]: name === 'costPerUnit' ? (value ? parseFloat(value) : undefined) : value,
      });
    }
  };

  const addNewInterest = () => {
    if (!newInterest.productDescription.trim()) {
      alert('Please describe what product you are looking for');
      return;
    }
    setGreenInterests([...greenInterests, newInterest]);
    setNewInterest({
      category: 'Sustainable Clothing',
      productDescription: '',
      organization: '',
      costPerUnit: undefined,
      notificationsEnabled: true,
    });
    setIsAddingInterest(false);
  };

  const removeInterest = (index) => {
    const updatedInterests = [...greenInterests];
    updatedInterests.splice(index, 1);
    setGreenInterests(updatedInterests);
  };

  const toggleNotification = (index) => {
    const updatedInterests = [...greenInterests];
    updatedInterests[index].notificationsEnabled = !updatedInterests[index].notificationsEnabled;
    setGreenInterests(updatedInterests);
  };

  const saveInterests = async () => {
    setIsSaving(true);
    try {
      console.log('Saving interests:', greenInterests);
      // Uncomment and adjust if you add a backend endpoint:
      // await api.post('/api/user/interests/', { interests: greenInterests });
      setIsEditingInterests(false);
    } catch (error) {
      console.error('Failed to update interests:', error.response?.data || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getBadgeInfo = (carbonFootprint) => {
    const currentBadge = badges.find(badge => 
      carbonFootprint >= badge.minCarbon && carbonFootprint < badge.maxCarbon
    ) || badges[0];
    const nextBadge = badges[badges.indexOf(currentBadge) + 1] || currentBadge;
    const progress = nextBadge.maxCarbon === Infinity 
      ? 100 
      : ((carbonFootprint - currentBadge.minCarbon) / (nextBadge.minCarbon - currentBadge.minCarbon)) * 100;
    return { currentBadge, nextBadge, progress: Math.min(progress, 100) };
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-container">Failed to load user profile</div>;
  }

  const { currentBadge, nextBadge, progress } = getBadgeInfo(user.carbon_footprint || 0);

  return (
    <div className="profile-container">
      <div className="notification-container">
        <div className="notification-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell className="notification-icon" />
          <span className="notification-badge">5+</span>
        </div>
        {showNotifications && (
          <div className="notification-dropdown">
            <h3 className="notification-title">Notifications</h3>
            {sampleNotifications.map((notification, index) => (
              <div key={index} className="notification-item">
                <p><strong>{notification.category}</strong></p>
                <p>{notification.productDescription}</p>
                {notification.organization && <p>From: {notification.organization}</p>}
                {notification.costPerUnit && <p>Max Price: ₹{notification.costPerUnit.toFixed(2)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <main className="profile-content">
        <div className="profile-header">
          <div className="profile-photo-container">
            <label htmlFor="photo-upload" className="photo-upload-label">
              {profilePhoto ? (
                <img src={profilePhoto} alt={user.username} className="profile-photo" />
              ) : (
                <User className="profile-photo-placeholder" />
              )}
              <div className="camera-overlay">
                <Camera className="camera-icon" />
              </div>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-upload-input"
            />
          </div>
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{user.productsBought || 0}</span>
            <span className="stat-label">Products Bought</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.productsSold || 0}</span>
            <span className="stat-label">Products Sold</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{(user.carbon_footprint || 0).toFixed(2)}</span>
            <span className="stat-label">Tons CO2 Saved</span>
          </div>
        </div>

        <div className="badge-section">
          <h2 className="badge-title">Your Eco Badge</h2>
          <div className="badge-container">
            <div 
              className="circular-progress" 
              style={{ 
                background: `conic-gradient(${currentBadge.color} ${progress}%, #e0e0e0 0)` 
              }}
            >
              <span className="badge-name">{currentBadge.name}</span>
            </div>
            <p className="badge-progress">
              {progress < 100 
                ? `${(nextBadge.minCarbon - user.carbon_footprint).toFixed(2)} tons to ${nextBadge.name}`
                : 'Max Rank Achieved!'}
            </p>
          </div>
        </div>

        <div className="green-interests-section">
          <div className="interests-header">
            <h2 className="interests-title">Product Notification Preferences</h2>
            <button
              className="edit-button"
              onClick={() => setIsEditingInterests(!isEditingInterests)}
              disabled={isSaving || isAddingInterest}
            >
              {isEditingInterests ? (
                <Save className="edit-icon" onClick={saveInterests} />
              ) : (
                <Edit2 className="edit-icon" />
              )}
            </button>
          </div>

          {isEditingInterests && !isAddingInterest && (
            <button
              className="add-interest-button"
              onClick={() => setIsAddingInterest(true)}
            >
              <PlusCircle className="add-icon" />
              <span>Add Product Alert</span>
            </button>
          )}

          {isAddingInterest && (
            <div className="add-interest-form">
              <h3>Get notified when these green products are posted</h3>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={newInterest.category}
                  onChange={handleNewInterestChange}
                  className="form-select"
                >
                  {greenInterestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="productDescription">What product are you looking for? *</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={newInterest.productDescription}
                  onChange={handleNewInterestChange}
                  className="form-textarea"
                  placeholder="Describe the specific product you want notifications for"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="organization">Preferred Organization/Brand (optional):</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={newInterest.organization}
                  onChange={handleNewInterestChange}
                  className="form-input"
                  placeholder="e.g., Patagonia, ThredUp, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="costPerUnit">Maximum Price (optional):</label>
                <input
                  type="number"
                  id="costPerUnit"
                  name="costPerUnit"
                  value={newInterest.costPerUnit || ''}
                  onChange={handleNewInterestChange}
                  className="form-input"
                  placeholder="Only notify me if price is below this amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <div className="notification-toggle">
                  <label htmlFor="notificationsEnabled">Enable notifications:</label>
                  <label className="notification-toggle-switch">
                    <input
                      type="checkbox"
                      id="notificationsEnabled"
                      name="notificationsEnabled"
                      checked={newInterest.notificationsEnabled}
                      onChange={handleNewInterestChange}
                    />
                    <span className="notification-toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => setIsAddingInterest(false)}
                >
                  Cancel
                </button>
                <button className="save-button" onClick={addNewInterest}>
                  Add Alert
                </button>
              </div>
            </div>
          )}

          {!isAddingInterest && (
            <div className="interests-list">
              {greenInterests.length > 0 ? (
                greenInterests.map((interest, index) => (
                  <div key={index} className="interest-card">
                    <div className="interest-card-header">
                      <h3 className="interest-category">
                        {interest.notificationsEnabled ? (
                          <Bell className="notification-bell" />
                        ) : (
                          <BellOff className="notification-bell" style={{ color: '#ccc' }} />
                        )}
                        {interest.category}
                      </h3>
                      {isEditingInterests && (
                        <button
                          className="remove-interest-button"
                          onClick={() => removeInterest(index)}
                        >
                          <X className="remove-icon" />
                        </button>
                      )}
                    </div>
                    <div className="interest-details">
                      <p><strong>Looking for:</strong> {interest.productDescription}</p>
                      {interest.organization && (
                        <p><strong>From:</strong> {interest.organization}</p>
                      )}
                      {interest.costPerUnit && (
                        <p><strong>Max Price:</strong> ₹{interest.costPerUnit.toFixed(2)}</p>
                      )}
                      {isEditingInterests && (
                        <div className="notification-preferences">
                          <div className="notification-toggle">
                            <span>Notifications:</span>
                            <label className="notification-toggle-switch">
                              <input
                                type="checkbox"
                                checked={interest.notificationsEnabled}
                                onChange={() => toggleNotification(index)}
                              />
                              <span className="notification-toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-interests">
                  <p>No product alerts set up yet.</p>
                  {isEditingInterests && (
                    <p>Click the button above to get notified when specific green products are posted.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <div style={{ paddingBottom: "80px" }}></div>

      <MobileNavbar />
    </div>
  );
};

export default ProfilePage;