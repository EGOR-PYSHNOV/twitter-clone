import TwitterIcon from '@material-ui/icons/Twitter';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Home } from './pages/Home';
import { ActiveUserPage } from './pages/ActiveUserPage';
import { UserPage } from './pages/User';
import { Layout } from './pages/Layout';
import { SignIn } from './pages/SignIn';
import { useHomeStyles } from './pages/theme';
import { fetchUserData } from './store/ducks/user/actionCreators';
import { selectIsAuth, selectUserStatus } from './store/ducks/user/selectors';
import { LoadingStatus } from './store/types';

function App() {
  const classes = useHomeStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const loadingStatus = useSelector(selectUserStatus);
  const isReady = loadingStatus !== LoadingStatus.NEVER && loadingStatus !== LoadingStatus.LOADING;

  React.useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  React.useEffect(() => {
    if (!isAuth && isReady) {
      history.push('/signin');
    } else if (history.location.pathname === '/') {
      history.push('/home');
    }
  }, [isAuth, isReady]);

  if (!isReady) {
    return (
      <div className={classes.centered}>
        <TwitterIcon color="primary" style={{ width: 80, height: 80 }} />
      </div>
    );
  }

  return (
    <div className="App">
      <Switch>
        <Route path="/signin" component={SignIn} exact />
        <Layout>
          <Route path="/home" component={Home} />
         <Route path="/user/:id" component={UserPage} exact />  
         <Route path="/user/activate/:hash" component={ActiveUserPage} exact />
        </Layout>
      </Switch>
    </div>
  );
}

export default App;
