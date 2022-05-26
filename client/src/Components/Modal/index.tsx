import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import styled from '@emotion/styled';
import BasicSelect from './selectInput';
import { PROPERTIES } from '../../config/properties';
import { useForm } from 'react-hook-form';
import useRegister from '../../hooks/query/auth/useRegister';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/query/auth/useLogin';

const SocialContainer = styled.div`
  display: flex;
  svg {
    margin-right: 10px;
    :hover {
      cursor: pointer;
    }
  }
`;

export default function FormModal() {
  const [open, setOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState('');
  const { register, getValues, handleSubmit } = useForm();
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleGithubLogin = async () => {
    window.location.href = PROPERTIES.BASE_URL + '/auth/signin/github';
  };
  const handleGoogleLogin = async () => {
    window.location.href = PROPERTIES.BASE_URL + '/auth/signin/google';
  };
  const onRegister = () => {
    registerMutate.mutate({
      email: getValues('email'),
      username: getValues('username'),
      password: getValues('password'),
    });
  };
  const onLogin = () => {
    loginMutate.mutate({
      email: getValues('email'),
      password: getValues('password'),
    });
  };
  const registerMutate = useRegister({
    onSuccess: () => {
      setIsLoginModal('login');
    },
  });
  const loginMutate = useLogin({
    onSuccess: () => {
      window.location.href = '/';
      setOpen(false);
    },
  });

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        로그인
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle>
          <BasicSelect setIsLoginModal={setIsLoginModal} />
        </DialogTitle>
        {isLoginModal === 'register' ? (
          <>
            <DialogContent>
              <form
                onSubmit={handleSubmit(() => {
                  onRegister();
                })}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  {...register('email')}
                />
                <TextField
                  margin="dense"
                  id="username"
                  label="username"
                  type="text"
                  fullWidth
                  variant="standard"
                  {...register('username')}
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="password"
                  type="password"
                  fullWidth
                  variant="standard"
                  {...register('password')}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={onRegister}>Subscribe</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <form
                onSubmit={handleSubmit(() => {
                  onLogin();
                })}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  {...register('email')}
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="password"
                  type="password"
                  fullWidth
                  variant="standard"
                  {...register('password')}
                />
              </form>
            </DialogContent>
            <div style={{ display: 'flex', marginLeft: 20 }}></div>
            <DialogActions>
              <SocialContainer>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                  style={{ height: 30, width: 30 }}
                  onClick={handleGithubLogin}
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                  style={{ height: 30, width: 30, marginRight: 195 }}
                  onClick={handleGoogleLogin}
                >
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
              </SocialContainer>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={onLogin}>Login</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}