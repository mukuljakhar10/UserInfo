import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface Address {
  city: string;
  street: string;
  number: string;
}

interface Name {
  firstname: string;
  lastname: string;
}

interface UserProfile {
  name: Name;
  email: string;
  phone: string;
  address: Address;
}

const UserProfileForm: React.FC = () => {
  const [userId, setUserId] = useState<number>(1); // Default userId
  const [profile, setProfile] = useState<UserProfile>({
    name: { firstname: '', lastname: '' },
    email: '',
    phone: '',
    address: { city: '', street: '', number: '' }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile(userId);
  }, [userId]);

  const loadUserProfile = (userId: number) => {
    setLoading(true);
    setError(null);
    fetch(`https://fakestoreapi.com/users/${userId}`)
      .then(response => response.json())
      .then((data: UserProfile) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading user profile');
        setLoading(false);
      });
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newUserId = parseInt(event.target.value, 10);
    setUserId(newUserId);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleNestedChange = (
    event: ChangeEvent<HTMLInputElement>,
    nestedField: keyof UserProfile
  ) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [nestedField]: {
        ...(prevProfile[nestedField] as object),
        [name]: value
      }
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    fetch(`https://fakestoreapi.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    })
      .then(response => response.json())
      .then(data => {
        alert('Profile updated successfully!');
        console.log('Updated profile:', data);
      })
      .catch(() => {
        alert('Error updating profile');
      });
  };

  return (
    <div>
      <label>Select User ID: </label>
      <select value={userId} onChange={handleUserIdChange}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(id => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={profile.name.firstname}
              onChange={(e) => handleNestedChange(e, 'name')}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={profile.name.lastname}
              onChange={(e) => handleNestedChange(e, 'name')}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={profile.address.city}
              onChange={(e) => handleNestedChange(e, 'address')}
            />
          </div>
          <div>
            <label>Street:</label>
            <input
              type="text"
              name="street"
              value={profile.address.street}
              onChange={(e) => handleNestedChange(e, 'address')}
            />
          </div>
          <div>
            <label>Street Number:</label>
            <input
              type="text"
              name="number"
              value={profile.address.number}
              onChange={(e) => handleNestedChange(e, 'address')}
            />
          </div>
          <button type="submit">Submit Changes</button>
        </form>
      )}
    </div>
  );
};

export default UserProfileForm;
