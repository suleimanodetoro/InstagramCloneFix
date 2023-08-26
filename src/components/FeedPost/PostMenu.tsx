import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";
import { useMutation } from "@apollo/client";
import { deletePost } from "./queries";
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  Post,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FeedNavigationProp, HomeStackNavigatorParamList, UpdatePostRouteProp } from "../../types/navigation";

interface IPostMenu {
  post: Post;
}

const PostMenu = ({ post }: IPostMenu) => {
  const navigation = useNavigation<FeedNavigationProp>();
  //Hacky solution to stop any user from deleting any post
  const { userId } = useAuthContext();
  const postUserId = post.User?.id;
  const isMyPost: Boolean = userId === postUserId;

  const [doDeletePost] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(deletePost, {
    variables: {
      input: {
        id: post.id,
        _version: post._version,
      },
    },
  });
  const onDeleteOptionPressed = () => {
    //Confirm the user actually wants to delete the post
    Alert.alert("Are you sure ?", "Deleting a post is permernent.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete Post",
        style: "destructive",
        onPress: startDeletingPost,
      },
    ]);
  };
  const startDeletingPost = async () => {
    const response = await doDeletePost();
    console.log(response);
  };

  const onEditFunctionPress = () => {    
    navigation.navigate('UpdatePost', {id:post.id});
  };
  return (
    <Menu renderer={renderers.SlideInMenu} style={styles.threeDots}>
      <MenuTrigger>
        <Entypo
          name={"dots-three-horizontal"}
          size={16}
        />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => alert(`Reporting...`)}>
          <Text style={styles.optionText}>Report</Text>
        </MenuOption>
        {isMyPost && (
          <>
            <MenuOption onSelect={onDeleteOptionPressed}>
              <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={onEditFunctionPress}>
              <Text style={styles.optionText}>Edit</Text>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default PostMenu;

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: "auto",
  },
  optionText: {
    fontSize: 16,
    padding: 10,
    textAlign: "center",
  },
});
