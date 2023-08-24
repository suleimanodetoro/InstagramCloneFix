import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import colors from '../theme/colors';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import { BottomTabNavigatorParamList } from '../types/navigation';
import SearchTabNavigator from './SearchTabNavigator';
import CameraScreen from '../screens/CameraScreen/CameraScreen';
import UploadStackNavigator from './UploadStackNavigator';


// The BTN should be used like a screen inside group navigator
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: colors.accent }}>
            <Tab.Screen name='HomeStack' component={HomeStackNavigator} options={{headerShown:false,
                tabBarIcon: ({ color, size }) => (<MaterialIcons name="home-filled" size={size} color={color} />)
            }} />
            <Tab.Screen name='Search' component={SearchTabNavigator} options={{headerShown:false,
                tabBarIcon: ({ color, size }) => (<MaterialIcons name="search" size={size} color={color} />)
            }} />
            <Tab.Screen name='Upload' component={UploadStackNavigator} options={{
                headerShown: false, tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="plus-circle-outline" size={size} color={color} />)
            }} />
            <Tab.Screen name='Notifications' component={ProfileScreen} options={{
                tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="heart-outline" size={size} color={color} />)
            }} />
            <Tab.Screen name='MyProfile' component={ProfileStackNavigator} options={{headerShown:false,
                tabBarIcon: ({ color, size }) => (<FontAwesome name="user-circle-o" size={size} color={color} />)
            }} />

        </Tab.Navigator>
    );
}

export default BottomTabNavigator