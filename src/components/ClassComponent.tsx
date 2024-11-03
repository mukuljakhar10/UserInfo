import React, { Component, ChangeEvent, FormEvent } from 'react';

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

interface UserProfileFormState {
  userId: number;
  profile: UserProfile;
  loading: boolean;
  error: string | null;
}

class UserProfileForm extends Component<{}, UserProfileFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userId: 1, // default selected user ID
      profile: {
        name: {
          firstname: '',
          lastname: ''
        },
        email: '',
        phone: '',
        address: {
          city: '',
          street: '',
          number: ''
        }
      },
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadUserProfile(this.state.userId);
  }

  loadUserProfile(userId: number) {
    this.setState({ loading: true, error: null });
    fetch(`https://fakestoreapi.com/users/${userId}`)
      .then(response => response.json())
      .then((data: UserProfile) => {
        this.setState({
          profile: data,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ error: 'Error loading user profile', loading: false });
      });
  }

  handleUserIdChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(event.target.value, 10);
    this.setState({ userId }, () => {
      this.loadUserProfile(userId);
    });
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
        [name]: value
      }
    }));
  };

  handleNestedChange = (event: ChangeEvent<HTMLInputElement>, nestedField: keyof UserProfile) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
        [nestedField]: {
          ...(prevState.profile[nestedField] as object),
          [name]: value
        }
      }
    }));
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { userId, profile } = this.state;

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
      .catch(error => {
        alert('Error updating profile');
        console.error('Error:', error);
      });
  };

  render() {
    const { userId, profile, loading, error } = this.state;

    return (
      <div>
        <label>Select User ID: </label>
        <select value={userId} onChange={this.handleUserIdChange}>
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
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={profile.name.firstname}
                onChange={(e) => this.handleNestedChange(e, 'name')}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={profile.name.lastname}
                onChange={(e) => this.handleNestedChange(e, 'name')}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={profile.address.city}
                onChange={(e) => this.handleNestedChange(e, 'address')}
              />
            </div>
            <div>
              <label>Street:</label>
              <input
                type="text"
                name="street"
                value={profile.address.street}
                onChange={(e) => this.handleNestedChange(e, 'address')}
              />
            </div>
            <div>
              <label>Street Number:</label>
              <input
                type="text"
                name="number"
                value={profile.address.number}
                onChange={(e) => this.handleNestedChange(e, 'address')}
              />
            </div>
            <button type="submit">Submit Changes</button>
          </form>
        )}
      </div>
    );
  }
}

export default UserProfileForm;
