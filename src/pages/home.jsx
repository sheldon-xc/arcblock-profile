import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';
import { useSessionContext } from '../libs/session';
import UserProfile from '../components/user-profile';

import logo from '../logo.svg';

function Home() {
  const { session, api } = useSessionContext();
  const [connectedUser, setConnectedUser] = useState({
    username: '',
    birthday: '',
    phone: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const [hasProfile, setHasProfile] = useState(false);

  const getData = useCallback(
    (id) => {
      api
        .get(`/api/info/${id}`)
        .then((res) => {
          setHasProfile(true);
          setConnectedUser(() => {
            const { data } = res.data;
            return {
              ...data,
            };
          });
        })
        .catch((e) => {
          if (e.response.data.code === 404) {
            setConnectedUser((res) => {
              return {
                ...res,
                did: session.user.did,
              };
            });
            setIsEditing(true);
          }
        });
    },
    [session.user, api]
  );

  useEffect(() => {
    // 查用户信息
    if (session.user && session.user.did) {
      getData(session.user.did);
    }
  }, [session.user, getData]);

  // 创建用户信息
  const createData = (req) => {
    api
      .post('/api/info', req)
      .then((res) => {
        setConnectedUser(res.data.data);
        setHasProfile(true);
      })
      .catch(() => {
        // window.location.reload();
      });
  };

  // 更新用户信息
  const updateData = (req) => {
    api
      .put(`/api/info/${req.did}`, req)
      .then((res) => {
        setConnectedUser(res.data.data);
      })
      .catch(() => {
        // window.location.reload();
      });
  };

  const loginHandle = () => {
    session.login();
  };

  const closeConnect = () => {
    session.logout();
    setConnectedUser({
      username: '',
      birthday: '',
      phone: '',
      email: '',
    });
    setHasProfile(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedUser) => {
    if (hasProfile) {
      updateData(updatedUser);
    } else {
      createData(updatedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
      </header>
      <main>
        {connectedUser?.did ? (
          <UserProfile
            hasProfile={hasProfile}
            isEditing={isEditing}
            user={connectedUser}
            onSave={handleSave}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Box sx={{ m: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Please click the button below to login before using the website.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button variant="contained" color="success" startIcon={<Fingerprint />} onClick={loginHandle}>
                Login
              </Button>
            </Grid>
          </Grid>
        )}

        {connectedUser?.did && (
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button color="error" onClick={closeConnect}>
                Sign out
              </Button>
            </Grid>
          </Grid>
        )}
      </main>
    </>
  );
}

export default Home;
