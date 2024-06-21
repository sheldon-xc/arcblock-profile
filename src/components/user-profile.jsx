import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Container, Grid, Avatar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  avatarWrap: {
    marginBottom: theme.spacing(2),
    textAlign: 'left',
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  formControl: {
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(2),
  },
}));

// 定义表单验证规则
const schema = yup.object().shape({
  username: yup.string().required('Full Name is required'),
  birthday: yup.date().required('Birthday is required').typeError('Invalid birthday'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[+]{1}(?:[0-9]\s?){6,15}[0-9]{1}$/, 'Invalid Phone.'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$/, 'Invalid email.'),
});

UserProfile.propTypes = {
  hasProfile: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    birthday: PropTypes.number || PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

function UserProfile({ hasProfile, isEditing, user, onSave, onCancel, onEdit }) {
  const classes = useStyles();

  const [formData, setFormData] = useState(user);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user.username,
      birthday: dayjs(user.birthday).format('YYYY-MM-DD'),
      phone: user.phone,
      email: user.email,
    },
  });

  useEffect(() => {
    setFormData(user);
    if (user) {
      setValue('username', user.username);
      setValue('phone', user.phone);
      setValue('email', user.email);
      setValue('birthday', dayjs(user.birthday).format('YYYY-MM-DD'));
    }
  }, [user, setValue]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      did: formData.did,
      birthday: dayjs(data.birthday).valueOf(),
    });
  };

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff; // eslint-disable-line no-bitwise
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  };

  // 取消
  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
    setValue('username', user.username);
    setValue('phone', user.phone);
    setValue('email', user.email);
    setValue('birthday', dayjs(user.birthday).format('YYYY-MM-DD'));
  };

  const renderTitle = () => {
    if (hasProfile) {
      return isEditing ? 'Edit Profile' : 'Profile';
    }
    return 'Create Profile';
  };
  const renderDesc = () => {
    if (hasProfile) {
      return isEditing ? 'Edit your profile details' : 'Your profile details';
    }
    return 'Create your profile details';
  };

  return (
    <Container className={classes.root} maxWidth="sm">
      <Grid container spacing={2} justifyContent="left">
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {renderTitle()}
          </Typography>
          <Typography variant="caption" gutterBottom>
            {renderDesc()}
          </Typography>
        </Grid>
        <Grid className={classes.avatarWrap} item xs={12}>
          <Avatar {...stringAvatar(formData.username || 'Guest')} className={classes.avatar} />
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              General Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={!isEditing}
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Birthday"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.birthday}
                  disabled={!isEditing}
                  helperText={errors.birthday ? errors.birthday.message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={!isEditing}
                  error={!!errors.phone}
                  helperText={errors.phone ? errors.phone.message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={!isEditing}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            {isEditing ? (
              <>
                {hasProfile ? (
                  <Button variant="contained" color="secondary" className={classes.button} onClick={handleCancel}>
                    Cancel
                  </Button>
                ) : null}
                <Button variant="contained" color="primary" className={classes.button} type="submit">
                  Save
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" className={classes.button} type="submit" onClick={onEdit}>
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default UserProfile;
