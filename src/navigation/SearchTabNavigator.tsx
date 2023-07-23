import React from 'react';
import { SafeAreaView } from "react-native"
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator<SearchTabNavigatorParamList>();
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import CommentsScreen from "../screens/CommentsScreen/CommentsScreen";
import colors from '../theme/colors';
import { SearchTabNavigatorParamList } from '../types/navigation';
import UserSearchScreen from '../screens/UserSearchScreen/UserSearchScreen';

const SearchTabNavigator = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator screenOptions={{ tabBarStyle: { paddingTop: insets.top }, tabBarIndicatorStyle:{backgroundColor: colors.accent} }}>
            <Tab.Screen name="Users" component={UserSearchScreen} />
            <Tab.Screen name="Posts" component={CommentsScreen} />
        </Tab.Navigator>


    )
}

export default SearchTabNavigator