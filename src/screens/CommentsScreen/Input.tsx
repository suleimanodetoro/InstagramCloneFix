import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import colors from "../../theme/colors";
import { size, weight } from "../../theme/fonts";
import {
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  Post,
} from "../../API";
import { useMutation, useQuery } from "@apollo/client";
import { commentsByPost, createComment } from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentService from "../../services/CommentService/CommentService";

interface IInput {
  postId: string;
}

const Input = ({ postId }: IInput) => {
  const insets = useSafeAreaInsets();
  const [newComment, setNewComment] = useState("");

  const { onCreateComment } = CommentService(postId);

  const onPost = async () => {
    //use hook function form comment service to post comment to database
    onCreateComment(newComment);
    setNewComment("");
  };
  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <Image
        style={styles.image}
        source={{
          uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg",
        }}
      />
      <TextInput
        value={newComment}
        multiline
        onChangeText={(newText) => setNewComment(newText)}
        style={styles.input}
        placeholder="Write your comment..."
      />
      <Text
        onPress={onPost}
        style={[styles.button, { bottom: insets.bottom + 12 }]}
      >
        POST
      </Text>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 5,
    borderTopWidth: 1,
    borderColor: colors.border,
    alignItems: "flex-end",
  },
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  input: {
    flex: 1,

    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,

    paddingVertical: 5,
    paddingRight: 50,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  button: {
    position: "absolute",
    right: 15,
    fontSize: size.small,
    fontWeight: weight.full,
    color: colors.primaryColor,
  },
});
