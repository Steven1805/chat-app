import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import * as yup from 'yup';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  email: yup.string().required('L\'email est requis').email('L\'email n\'est pas valide'),
  password: yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre'),
});

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    const onSubmit = async (data: FormData) => {
      try {
        const response = await axios.post('http://localhost:8080/users/', data);
        const { email, password } = response.data;
    
        // Créer les cookies
        Cookies.set('email', email);
        Cookies.set('password', password);
    
        // Rediriger vers la page de profil
        router.push('/profile');
      } catch (error) {
        console.log(error);
      }
    };
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input type="password" id="confirmPassword" {...register('confirmPassword')} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default SignUpForm;
