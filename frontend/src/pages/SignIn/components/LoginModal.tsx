import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStylesSignIn } from '..';
import { ModalBlock } from '../../../components/ModalBlock';
import { Notification } from '../../../components/Notification';
import { Color } from '@material-ui/lab/Alert';
import { fetchSignIn } from '../../../store/ducks/user/actionCreators';
import { selectUserStatus } from '../../../store/ducks/user/selectors';
import { LoadingStatus } from '../../../store/types';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export interface LoginFormProps {
  email: string;
  password: string;
}

const LoginFormSchema = yup.object().shape({
  email: yup.string().email('Неверная почта').required('Введите почту'),
  password: yup.string().min(6, '​Минимальная длина пароля 6 символов').required(),
});

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }): React.ReactElement => {
  const classes = useStylesSignIn();
  const dispatch = useDispatch();
  // TODO: Не бейте меня
  const openNotificationRef = React.useRef<(text: string, type: Color) => void>(() => {});
  const loadingStatus = useSelector(selectUserStatus);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({
    resolver: yupResolver(LoginFormSchema),
  });

  const onSubmit = async (data: LoginFormProps) => {
    dispatch(fetchSignIn(data));
  };

  React.useEffect(() => {
    if (loadingStatus === LoadingStatus.SUCCESS) {
      openNotificationRef.current('Авторизация успешна!', 'success');
      onClose();
    } else if (loadingStatus === LoadingStatus.ERROR) {
      openNotificationRef.current('Неверный логин или пароль', 'error');
    }
  }, [loadingStatus]);

  return (
    <ModalBlock visible={open} onClose={onClose} classes={classes} title="Войти в аккаунт">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl className={classes.loginFormControl} component="fieldset" fullWidth>
          <FormGroup aria-label="position" row>
            <Controller
              render={({ field }) => (
                <TextField
                  id="email"
                  className={classes.loginSideField}
                  label="E-Mail"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  type="email"
                  helperText={errors.email?.message}
                  error={!!errors.email}
                  fullWidth
                  autoFocus
                  {...field}
                />
              )}
              defaultValue=""
              control={control}
              name="email"
            />
            <Controller
              render={({ field }) => (
                <TextField
                  id="password"
                  label="Пароль"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  type="password"
                  helperText={errors.password?.message}
                  error={!!errors.password}
                  fullWidth
                  {...field}
                />
              )}
              defaultValue=""
              control={control}
              name="password"
            />
            <Button
              disabled={loadingStatus === LoadingStatus.LOADING}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth>
              Войти
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </ModalBlock>
  );
};
