import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type ChannelData = {
  name: string;
  isPublic: boolean;
  selectedUsers: string[];
};

const EditChannelPage = () => {
  const { handleSubmit, register, setValue } = useForm<ChannelData>();
  const [users, setUsers] = useState<string[]>([]);
  const channel_id = 'your_channel_id'; // Replace with the actual channel ID

  useEffect(() => {
    fetchUsers();
    fetchChannelData(channel_id);
  }, [channel_id]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChannelData = async (channelId: string) => {
    try {
      const response = await axios.get(`/api/channel/${channelId}`);
      const { name, isPublic, selectedUsers } = response.data;
      setValue('name', name);
      setValue('isPublic', isPublic);
      setValue('selectedUsers', selectedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: ChannelData) => {
    try {
      await axios.put(`/api/channel/${channel_id}`, data);
      // Redirect to the channel page or show a success message
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Edit Channel: {channel_id}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Channel Name</label>
          <input type="text" id="name" {...register('name')} />
        </div>

        <div>
          <label htmlFor="isPublic">Is Public?</label>
          <input type="checkbox" id="isPublic" {...register('isPublic')} />
        </div>

        {!register('isPublic').value && (
          <div>
            <label htmlFor="selectedUsers">Selected Users</label>
            <select id="selectedUsers" multiple {...register('selectedUsers')}>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit">Update Channel</button>
      </form>
    </div>
  );
};

export default EditChannelPage;
