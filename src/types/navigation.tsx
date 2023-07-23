//Use this to stop typescript from yelling when using navigation hooks in your componenets
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
export type RootNavigatorParamList = {
    Auth: undefined;
    Home: undefined;
    Comments: {postId: string};
  };
  // Auth Stack Navigator
export type AuthStackNavigatorParamList = {
    'Sign in': undefined;
    'Sign up': undefined;
    'Confirm email': {username?: string};
    'Forgot password': undefined;
    'New password': undefined;
};
export type SignInNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Sign in'
>;

export type SignUpNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Sign up'
>;

export type ConfirmEmailNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Confirm email'
>;
export type ConfirmEmailRouteProp = RouteProp<
  AuthStackNavigatorParamList,
  'Confirm email'
>;

export type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'Forgot password'
>;

export type NewPasswordNavigationProp = NativeStackNavigationProp<
  AuthStackNavigatorParamList,
  'New password'
>;

 
export type BottomTabNavigatorParamList = {
    HomeStack: undefined;
    Search: undefined;
    Upload: undefined;
    Notifications: undefined;
    MyProfile:undefined;
}

export type SearchTabNavigatorParamList = {
    Users: undefined;
    Posts: undefined
}

export type MyProfileRouteProp = RouteProp<BottomTabNavigatorParamList, 'MyProfile'>

export type MyProfileNavigationProp = BottomTabNavigationProp<BottomTabNavigatorParamList, 'MyProfile'>

export type HomeStackNavigatorParamList = {
    Feed: undefined;
    UserProfile: {userId: string}
}

export type UserProfileNavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'UserProfile'>
//routing
export type UserProfileRouteProp = RouteProp<HomeStackNavigatorParamList, 'UserProfile'>


export type ProfileStackNavigatorParamList ={
    Profile: undefined;
    'Edit Profile': undefined;
}

//This requires the parent of the componenet you are trying to go to (Say we want to naviagte to 'Feed', that means we will use HomeStackNavigator as the parent)
//The second param to be given is the name of the route
//Now with the following type, you can import it in your Feed component and use it in your useNavigation hook
export type FeedNavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'Feed'>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackNavigatorParamList, 'Profile'>;
