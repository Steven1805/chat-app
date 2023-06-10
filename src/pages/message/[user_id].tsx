import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

type UserData = {
    id: string;
    name: string;
  };
  
  type MessageData = {
    sender: string;
    date: string;
    message: string;
  };
  

const MessagePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const { register, handleSubmit, reset } = useForm<MessageData>();
  const router = useRouter();
  const { user_id } = router.query;

  useEffect(() => {
    if (user_id) {
      fetchUserData(user_id as string);
      fetchMessages(user_id as string);
    }
  }, [user_id]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`'http://localhost:8080/users'${userId}`);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: MessageData) => {
    try {
      await axios.post(`http://localhost:8080/message/${user_id}`, data);
      // Reset the form after successful submission
      reset();
      // Fetch updated messages
      fetchMessages(user_id as string);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Direct Messages with </h1> {/*user.name*/}

      {/* Render the list of messages */}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>{message.sender}</p>
            <p>{message.date}</p>
            <p>{message.message}</p>
          </li>
        ))}
      </ul>

      {/* Send Message Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea id="message" {...register('message')}></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default MessagePage;
