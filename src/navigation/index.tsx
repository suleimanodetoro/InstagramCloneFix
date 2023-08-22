import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import EditProfileScreen from "../screens/EditProfileScreen/EditProfileScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import PostUploadScreen from "../screens/PostUploadScreen/PostUploadScreen";
import CommentsScreen from "../screens/CommentsScreen/CommentsScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import { RootNavigatorParamList } from "../types/navigation";
import AuthStackNavigator from "./AuthStackNavigator";
import { useAuthContext } from "../contexts/AuthContext";

import { useQuery } from "@apollo/client";
import { getUser } from "./queries";
import { GetUserQuery, GetUserQueryVariables } from "../API";

const Stack = createNativeStackNavigator<RootNavigatorParamList>(); //This will return an object that contains Navigator and screen

const linking: LinkingOptions<RootNavigatorParamList> = {
  //
  prefixes: ["instagramm:://", "https://instagramm.com"],
  config: {
    initialRouteName: "Home",
    screens: {
      //anytime you open the link instagramm:://comments, it'll open the comments screen
      Comments: "comments",
      Home: {
        screens: {
          HomeStack: {
            initialRouteName: "Feed",
            screens: {
              UserProfile: "user/:userId",
            },
          },
        },
      },
    },
  },
};
const Navigation = () => {
  const { user, userId } = useAuthContext();
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(getUser, {variables: {id:userId}});
  const userData = data?.getUser;
  console.log(userData);

  /**
   * if user is undefined(default) show loading screen till useEffect is triggered from authcontext
   * Once triggered, check if previous logegd in user exists, else set user to null. When user is null, login screen will be shown
   * Null !=== undefined hence Login in screen will be displayed.
   */

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  let stackScreens = null;
  //Check if user is false (kinda null haha) then navigate to root in authstack which is login screen
  if (!user) {
    stackScreens = (
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{headerShown: false}}
      />
    );
    //User does not have a username? direct them to edit screen
  } else if (!userData?.username) {
    stackScreens = (
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Setup Profile'}}
      />
    );
    //Go straight to home screen if user is good to go hehe
  } else {
    stackScreens = (
      <>
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />

        <Stack.Screen name="Comments" component={CommentsScreen} />
      </>
    );
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {/* When you assign components to a navigator, props are automatically passed to it and can be accessed in that componenet */}
      {/* To have the functionality of the dot under the focused tab, we will nest stack navigators */}
      {/* // if user is falsy (undefined), display auth screen, else display home screen  */}

      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {stackScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
