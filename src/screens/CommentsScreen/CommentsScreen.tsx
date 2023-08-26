import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Comment from "../../components/Comment/";
import Input from "./Input";
import { useRoute } from "@react-navigation/native";
import { CommentsRouteProp } from "../../types/navigation";
import { commentsByPost } from "./queries";
import { CommentsByPostQuery, CommentsByPostQueryVariables } from "../../API";
import { useQuery } from "@apollo/client";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";

const CommentsScreen = () => {
  const route = useRoute<CommentsRouteProp>();
  const { postId } = route?.params;
  const { data, loading, error } = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {
    variables: {
      postID: postId,
    },
    errorPolicy: "all",
  });
  if (loading) {
    <ActivityIndicator />;
  }
  if (error) {
    <ApiErrorMessage title="Error fetching comments" message={error.message} />;
  }
  const comments = (data?.commentsByPost?.items  || []).filter(comment => !comment._deleted);


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={comments}
        renderItem={({ item }) => <Comment comment={item} includeDetails />}
        style={{ padding: 10 }}
        ListEmptyComponent={()=> <Text>No comments here yet🤔</Text>}
      />

      {/* Comment text field only visible in comment screen */}
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({});
