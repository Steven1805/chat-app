import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/client';
import { useState } from 'react';
//import { User } from '../path/to/types';

interface CreateChannelFormData {
  name: string;
  users: string[];
}

const CreateChannelForm = () => {
  const { handleSubmit, register } = useForm<CreateChannelFormData>();
  //const [session] = useSession();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const onSubmit = (data: CreateChannelFormData) => {
    const { name, users } = data;
    // Perform channel creation operations here using Firebase
    console.log('Name of the new channel:', name);
    console.log('Users to add to the channel:', users);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name of the new channel</label>
        <input type="text" id="name" {...register('name')} />
      </div>

      <div>
        <label>Users to add to the channel</label>
        <div>
          <input
            type="checkbox"
            id="user1"
            value="user1"
            onChange={(e) =>
              setSelectedUsers((prevUsers) => {
                if (e.target.checked) {
                  return [...prevUsers, e.target.value];
                } else {
                  return prevUsers.filter((user) => user !== e.target.value);
                }
              })
            }
          />
          <label htmlFor="user1">User 1</label>
        </div>
      </div>

      <button type="submit">Create Channel</button>
    </form>
  );
};

export default CreateChannelForm;
