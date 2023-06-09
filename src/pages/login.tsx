import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import * as yup from 'yup';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis'),
});

const LoginForm = () => {
  const {handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('/http://localhost:8080/users/login', data);
      const { email, password } = response.data;
  
      // Créer les cookies
      Cookies.set('email', email);
      Cookies.set('password', password);
  
      // Rediriger vers une autre page après l'authentification
      router.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email"/>
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password"/>
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit">Se connecter</button>
    </form>

    <div>
        <p>Do not have an account yet? <Link href="/sign-up">Register here!</Link></p>
      </div>
  </>
  );
};

export default LoginForm;
