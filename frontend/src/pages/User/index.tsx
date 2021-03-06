import { Avatar, CircularProgress } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { BackButton } from '../../components/BackButton';
import { useHomeStyles } from '../theme';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import classNames from 'classnames';
import Skeleton from '@material-ui/lab/Skeleton';

import './User.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsTweetsLoading, selectTweetsItems } from '../../store/ducks/tweets/selectors';
import { Tweet } from '../../components/Tweet';
import { fetchTweets } from '../../store/ducks/tweets/actionCreators';
import { User } from '../../store/ducks/user/contracts/state';
import { AuthApi } from '../../services/api/authApi';
import { RouteComponentProps } from 'react-router-dom';

export const UserPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const classes = useHomeStyles();
  const tweets = useSelector(selectTweetsItems);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsTweetsLoading);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<User | undefined>();


console.log(userData)

  React.useEffect(() => {
    const userId = match.params.id;
    dispatch(fetchTweets());
    if (userId) {
      AuthApi.getUserInfo(userId).then(({ data }) => {
        setUserData(data);
      });
    }
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper className={classNames(classes.tweetsWrapper, 'user')} variant="outlined">
      <Paper className={classes.tweetsHeader} variant="outlined">
        <BackButton />

        <div>
          <Typography variant="h6">{userData?.fullname}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
            {tweets.length} ??????????
          </Typography>
        </div>
      </Paper>

      <div className="user__header"></div>

      <div className="user__info">
        <Avatar />
        {!userData ? (
          <Skeleton variant="text" width={250} height={30} />
        ) : (
          <h2 className="user__info-fullname">{userData?.fullname}</h2>
        )}
        {!userData ? (
          <Skeleton variant="text" width={60} />
        ) : (
          <span className="user__info-username">@{userData?.username}</span>
        )}

      </div>
      <Tabs value={activeTab} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        <Tab label="??????????" />
        <Tab label="?????????? ?? ????????????" />
        <Tab label="??????????" />
        <Tab label="????????????????" />
      </Tabs>
      <div className="user__tweets">
        {isLoading ? (
          <div className={classes.tweetsCentred}>
            <CircularProgress />
          </div>
        ) : (
          tweets.map((tweet) => (
            <Tweet key={tweet._id} classes={classes} images={tweet.images} {...tweet} />
          ))
        )}
      </div>
    </Paper>
  );
};
