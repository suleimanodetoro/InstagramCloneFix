import { StyleSheet, Text, Image } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import logo from '../assets/images/logo.png';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import { ProfileStackNavigatorParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProfileStackNavigatorParamList>();
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Profile' component={ProfileScreen} />
        <Stack.Screen name='Edit Profile' component={EditProfileScreen} options={{title:'Profile'}}/>
    </Stack.Navigator>
  )
};
const HeaderTitle = () => {
    return (
        <Image source={logo} resizeMode='cover' style={{ width: 150, height: 40}} />
    )

};

export default ProfileStackNavigator

