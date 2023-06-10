import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

type ChannelData = {
  channelName: string;
  selectedUsers: string[];
  isPublic: boolean;
};

const ChannelEditPage = () => {
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const { register, handleSubmit } = useForm<ChannelData>();
  const router = useRouter();
  const { channel_id } = router.query;

  useEffect(() => {
    if (channel_id) {
    const channelIdString = Array.isArray(channel_id) ? channel_id[0] : channel_id;
      fetchChannelData(channelIdString);
    }
  }, [channel_id]);

  const fetchChannelData = async (channelId: string) => {
    try {
      const response = await axios.get(`/api/channel/${channelId}`);
      setChannel(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: ChannelData) => {
    try {
      await axios.put(`/api/channel/${channel_id}`, data);
      // Handle successful update
      router.push('/channels');
    } catch (error) {
      console.log(error);
    }
  };

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Channel</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="channelName">Channel Name</label>
          <input type="text" id="channelName" defaultValue={channel.channelName} {...register('channelName')} />
        </div>

        {/* Render the rest of the form fields */}

        <button type="submit">Update Channel</button>
      </form>
    </div>
  );
};

export default ChannelEditPage;
