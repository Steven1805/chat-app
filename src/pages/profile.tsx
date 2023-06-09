import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormData = {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  bio: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  email: yup.string().required('L\'email est requis').email('L\'email n\'est pas valide'),
  oldPassword: yup.string().required('L\'ancien mot de passe est requis'),
  newPassword: yup.string().required('Le nouveau mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre'),
  bio: yup.string(),
});

const ProfilePage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Récupérer les informations utilisateur actuelles depuis l'API et les définir dans les champs du formulaire
    const fetchUserData = async () => {
      try {
        // Faites une requête à l'API pour obtenir les informations de l'utilisateur actuel
        const userData = await getCurrentUser();

        // Définir les valeurs dans les champs du formulaire
        setValue('name', userData.name);
        setValue('email', userData.email);
        setValue('bio', userData.bio || ''); // Si la bio est null ou undefined, définir une valeur vide par défaut
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Envoyer les données du formulaire à l'API pour mettre à jour le profil utilisateur
      await updateUser(data);

      // Afficher un message de confirmation de mise à jour du profil
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" {...register('name')} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register('email')} />
      </div>

      <div>
        <label htmlFor="oldPassword">Ancien mot de passe</label>
        <input type="password" id="oldPassword" {...register('oldPassword')} />
      </div>

      <div>
        <label htmlFor="newPassword">Nouveau mot de passe</label>
        <input type="password" id="newPassword" {...register('newPassword')} />
      </div>

      <div>
        <label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</label>
        <input type="password" id="confirmNewPassword" {...register('confirmNewPassword')} />
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" {...register('bio')} />
      </div>

      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default ProfilePage;
