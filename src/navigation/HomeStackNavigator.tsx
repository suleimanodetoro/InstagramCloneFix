import { StyleSheet, Text, Image } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import logo from '../assets/images/logo.png';
import { HomeStackNavigatorParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Feed' component={HomeScreen} options={{headerTitle:HeaderTitle}} />
        <Stack.Screen name='UserProfile' component={ProfileScreen} options={{title:'Profile'}}/>
    </Stack.Navigator>
  )
};
const HeaderTitle = () => {
    return (
        <Image source={logo} resizeMode='cover' style={{ width: 150, height: 40}} />
    )

};

export default HomeStackNavigator

