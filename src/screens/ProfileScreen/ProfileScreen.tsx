import { Image, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import FeedGridView from "../../components/FeedGridView/";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  MyProfileNavigationProp,
  UserProfileNavigationProp,
} from "../../types/navigation";
import {
  UserProfileRouteProp,
  MyProfileRouteProp,
} from "../../types/navigation";

import { useQuery } from "@apollo/client";
import { getUser } from "./queries";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";
import { GetUserQuery, GetUserQueryVariables } from "../../API";

const ProfileScreen = () => {
  const route = useRoute<MyProfileRouteProp | UserProfileRouteProp>();
  const navigation = useNavigation<
    MyProfileNavigationProp | UserProfileNavigationProp
  >();
  //Destructure user data being passes from FeedPost=>
  const userId = route.params?.userId;
  const { data, loading, error } = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(getUser, {
    variables: { id: userId }, //providing ID cause the query(see query file) requires it
    errorPolicy: "all",
  });

  const user = data?.getUser;

  //if loading is true, display loaidng indicator

  if (loading) {
    return <ActivityIndicator />;
  }
  //If error exists in the query or if user is undefined
  if (error || !user) {
    return (
      <ApiErrorMessage
        title="Error fetching the User"
        message={error.message || "User not found"}
      />
    );
  }

  //If both if statements are false, display =>

  return (
    //GridView Profile Media

    <FeedGridView
      data={user.Posts?.items || []}
      ListHeaderComponent={() => <ProfileHeader user={user} />}
    />
  );
};

export default ProfileScreen;
