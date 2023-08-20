import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import UserListItem from "../../components/UserListItem/";

import { listUsers } from "./queries";
import { useQuery } from "@apollo/client";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";
import { ListUsersQuery, ListUsersQueryVariables } from "../../API";

const UserSearchScreen = () => {
  const { data, error, loading, refetch } = useQuery<
    ListUsersQuery | ListUsersQueryVariables
  >(listUsers);
  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    <ApiErrorMessage
      title={"User search failed, please retry"}
      message={error.message}
    />;
  }
  const users = data?.listUsers?.items || [];
  return (
    <FlatList
      data={users}
      renderItem={({ item }) =>item && <UserListItem user={item} />}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
};

export default UserSearchScreen;

const styles = StyleSheet.create({});
