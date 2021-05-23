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
import { fetchSignIn, fetchSignUp } from '../../../store/ducks/user/actionCreators';
import { selectUserStatus } from '../../../store/ducks/user/selectors';
import { LoadingStatus } from '../../../store/types';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export interface RegisterFormProps {
  fullname: string;
  username: string;
  email: string;
  password: string;
  password2: string;
}

const RegisterFormSchema = yup.object().shape({
  fullname: yup.string().required('Введите своё имя'),
  email: yup.string().email('Неверная почта').required('Введите почту'),
  username: yup.string().required('Введите логин'),
  password: yup.string().min(6, '​Минимальная длина пароля 6 символов').required(),
  password2: yup.string().oneOf([yup.ref('password')], 'Пароли не соответствуют'),
});

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
}): React.ReactElement => {
  const classes = useStylesSignIn();
  const dispatch = useDispatch();
  // TODO: Не бейте меня
  const openNotificationRef = React.useRef<(text: string, type: Color) => void>(() => {});
  const loadingStatus = useSelector(selectUserStatus);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(RegisterFormSchema),
  });

  const onSubmit = async (data: RegisterFormProps) => {
    dispatch(fetchSignUp(data));
  };

  React.useEffect(() => {
    if (loadingStatus === LoadingStatus.SUCCESS) {
      openNotificationRef.current('Регистрация успешна!', 'success');
      onClose();
    } else if (loadingStatus === LoadingStatus.ERROR) {
      openNotificationRef.current('Ошибка при регистрации!', 'error');
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
                  className={classes.registerField}
                  id="email"
                  label="E-Mail"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  type="email"
                  helperText={errors.email?.message}
                  {...field}
                  error={!!errors.email}
                  fullWidth
                  autoFocus
                />
              )}
              control={control}
              name="email"
              defaultValue=""
            />

            <Controller
              render={({ field }) => (
                <TextField
                  className={classes.registerField}
                  id="username"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Логин"
                  variant="filled"
                  type="text"
                  helperText={errors.username?.message}
                  {...field}
                  error={!!errors.username}
                  fullWidth
                />
              )}
              control={control}
              name="username"
              defaultValue=""
            />
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  className={classes.registerField}
                  id="fullname"
                  label="Ваше имя"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  type="text"
                  helperText={errors.fullname?.message}
                  error={!!errors.fullname}
                  fullWidth
                />
              )}
              control={control}
              name="fullname"
              defaultValue=""
            />
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  className={classes.registerField}
                  id="password"
                  helperText={errors.password?.message}
                  type="password"
                  error={!!errors.password}
                  variant="filled"
                  fullWidth
                  label="Пароль"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
              control={control}
              name="password"
              defaultValue=""
            />
            <Controller
              render={({ field }) => (
                <TextField
                  {...field}
                  className={classes.registerField}
                  id="password2"
                  label="Пароль"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  type="password"
                  helperText={errors.password2?.message}
                  error={!!errors.password2}
                  fullWidth
                />
              )}
              control={control}
              name="password2"
              defaultValue=""
            />
            <Button
              disabled={loadingStatus === LoadingStatus.LOADING}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth>
              Регистрация
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </ModalBlock>
  );
};
