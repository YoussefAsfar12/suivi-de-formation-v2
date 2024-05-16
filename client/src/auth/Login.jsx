import {  useState } from 'react';
import { useAuth } from '../AuthContext/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, Typography, Container, CssBaseline, Avatar, Alert, AlertTitle, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../api/api';

const schema = yup.object().shape({
  email: yup.string().required('email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);
  const {setUser,setUnreadNotificationsCount} = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  

  const handleLogin = async(data) => {

    try {
      setIsSubmitting(true);
      const foundUser = await login(data);
   
      console.log(foundUser)
      if (foundUser) {
        setUser(foundUser);
        setUnreadNotificationsCount(foundUser.unread_notifications);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000); 
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      if(error.response.status === 401) {
        alert('Invalid email or password');
        
      }
    }finally{
      setIsSubmitting(false);
    }
   
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button fullWidth variant="contained" color="primary" type="submit">
          {isSubmitting ?  <CircularProgress sx={{color:'white'}} size={24}  /> : 'Se connecter'}
          </Button>
        </form>
        {showAlert && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>Login successful!</AlertTitle>
            Bienvenue
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default Login;
