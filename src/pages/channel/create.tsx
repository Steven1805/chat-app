import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type User = {
  id: string;
  name: string;
};

type FormData = {
  channelName: string;
  selectedUsers: string[];
  isPublic: boolean;
};

const ChannelCreatePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { register, handleSubmit } = useForm<FormData>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    // Fetch the list of users from the backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId: string) => {
    const updatedSelectedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedSelectedUsers);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the data to be sent to the backend
      const requestData = {
        channelName: data.channelName,
        selectedUsers: selectedUsers.map((user) => user.id),
        isPublic: data.isPublic,
      };

      // Send the data to the backend API to create the channel
      const response = await axios.post('/api/channel/create', requestData);

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePublicToggle = () => {
    setIsPublic(!isPublic);
    if (!isPublic) {
      setSelectedUsers([]);
    }
  };

  return (
    <div>
      <h1>Create Channel</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="channelName">Channel Name</label>
          <input type="text" id="channelName" {...register('channelName')} />
        </div>

        {isPublic ? (
          <p>Channel is public</p>
        ) : (
          <div>
            <h3>Selected Users</h3>
            {selectedUsers.map((user) => (
              <div key={user.id}>
                <p>{user.name}</p>
                <button type="button" onClick={() => handleUserRemove(user.id)}>
                  Remove
                </button>
              </div>
            ))}

            <h3>All Users</h3>
            <select {...register('selectedUsers')} onChange={(e) => handleUserSelect(e.target.value)}>
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="isPublic">Is Public</label>
          <input type="checkbox" id="isPublic" {...register('isPublic')} onChange={handlePublicToggle} />
        </div>

        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
};

export default ChannelCreatePage
