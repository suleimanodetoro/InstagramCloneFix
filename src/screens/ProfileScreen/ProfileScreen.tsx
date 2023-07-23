import { Image, FlatList } from 'react-native';
import React from 'react';
import user from '../../assets/data/user.json';
import ProfileHeader from './ProfileHeader';
import FeedGridView from '../../components/FeedGridView/';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MyProfileNavigationProp, UserProfileNavigationProp } from '../../types/navigation';
import { UserProfileRouteProp, MyProfileRouteProp } from '../../types/navigation';


const ProfileScreen = () => {

  const route = useRoute<MyProfileRouteProp | UserProfileRouteProp>();
  const navigation = useNavigation<MyProfileNavigationProp | UserProfileNavigationProp>();
  //Destructure user data being passes from FeedPost=>
  const userId = route.params?.userId;
  console.log(user.posts);
  
  
  
  return (
    //GridView Profile Media
    
    <FeedGridView data={user.posts} ListHeaderComponent={ProfileHeader} />

  )

}

export default ProfileScreen;
