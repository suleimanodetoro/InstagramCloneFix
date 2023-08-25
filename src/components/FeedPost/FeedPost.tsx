import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import styles from "./styles";
import { size } from "../../theme/fonts";
import colors from "../../theme/colors";
import Comment from "../Comment/Comment";
import DoublePressable from "../DoublePressable/";
import Carousel from "../Carousel/Carousel";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteCommentMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  Post,
  UsersByUsernameQuery,
  UsersByUsernameQueryVariables,
} from "../../API";

//import hook to enable naviagtion functionality
import { useNavigation } from "@react-navigation/native";
import { FeedNavigationProp } from "../../types/navigation";
import { DEFAULT_USER_IMAGE } from "../../config";

import PostMenu from "./PostMenu";
import { useMutation, useQuery } from "@apollo/client";
import { LikesForPostByUser, createLike, deleteLike } from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
  const { userId } = useAuthContext();
  const { post } = props;
  const { isVisible } = props;
  const [isLiked, setLikeState] = useState(false);
  const [descriptionExpended, setDescriptionExpanded] = useState(false);

  //function for like mutation
  const [doCreateLike, { error: createLikeError }] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {
    variables: {
      input: { userID: userId, postID: post.id },
      //anytime a like is created, run the query already defined again to make sure likes show as soon as they are created
    },
    refetchQueries: ["LikesForPostByUser"],
  });
  //function to delete the like of a post
  const [doDeleteLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike);

  //query to check posts liked by a user
  //Created by adding query field in schema.graphql
  // usersLikeData will be created for every post
  const {
    data: usersLikeData,
    loading,
    error,
  } = useQuery<LikesForPostByUserQuery, LikesForPostByUserQueryVariables>(
    LikesForPostByUser,
    {
      variables: {
        postID: post.id,
        userID: {
          //eq is an equal operation
          eq: userId,
        },
      },
    }
  );

  //store like not deleted
  const userLike = (usersLikeData?.LikesForPostByUser?.items || []).filter(likes => !likes?._deleted)[0];

  const naviagtion = useNavigation<FeedNavigationProp>();
  const navigateToUser = () => {
    if (post.User) {
      naviagtion.navigate("UserProfile", { userId: post.User?.id });
    }
  };

  const navigateToComments = () => {
    naviagtion.navigate("Comments", { postId: post.id });
  };

  const navigateToLikesPage = () =>{
    naviagtion.navigate("PostLikes", {id:post.id})

  }

  //Expand description
  const toggleDescriptionExpansion = () => {
    setDescriptionExpanded((existingValue) => {
      return !descriptionExpended;
    });
  };
  const toggleLikeState = () => {
    // if user already liked the post...
    if (userLike) {
      doDeleteLike({
        variables: {
          input: {
            id: userLike.id,
            _version: userLike._version,
          },
        },
      });
      //Like post if post is not already liked
    } else {
      doCreateLike();
    }
  };

  let content = null;
  if (post.image) {
    content = (
      <DoublePressable onDoublePress={toggleLikeState}>
        <Image
          source={{
            uri: post.image,
          }}
          style={styles.image}
        />
      </DoublePressable>
    );
  } else if (post.images) {
    content = <Carousel images={post.images} onDoublePress={toggleLikeState} />;
  } else if (post.video) {
    content = (
      <VideoPlayer
        uri={post.video}
        paused={!isVisible}
        onDoublePress={toggleLikeState}
      />
    );
  }

  return (
    <View style={styles.post}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: post.User?.image || DEFAULT_USER_IMAGE,
          }}
          style={styles.userAvatar}
        />

        <Pressable onPress={navigateToUser}>
          <Text style={styles.userName}>{post.User?.username}</Text>
        </Pressable>
        <PostMenu post={post} />
      </View>

      {/* Content */}

      {content}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={toggleLikeState}>
            <AntDesign
              name={userLike ? "heart" : "hearto"}
              size={24}
              style={styles.icon}
              color={userLike ? colors.accent : colors.black}
            />
          </Pressable>

          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{ marginLeft: "auto" }}
            color={colors.black}
          />
        </View>
        {/* lIKED BY XXXX  */}
        {/* Text element nesting is allowed in react native */}
        <Text style={styles.text} onPress={navigateToLikesPage}>
          Liked by <Text style={styles.bold}>iddrissanddu</Text> and{" "}
          <Text style={styles.bold}>{post.nOfLikes} others</Text>
        </Text>
        {/* Post Description */}
        <Text
          numberOfLines={descriptionExpended ? 0 : 3}
          onPress={toggleDescriptionExpansion}
        >
          <Text style={styles.text}>
            <Text style={styles.bold}>{post.User?.username}</Text>{" "}
            {post.description}
          </Text>
        </Text>

        {/* Post Comments */}
        <Text onPress={navigateToComments} style={{ color: "grey" }}>
          View all {post.nOfComments} comments
        </Text>
        {(post.Comments?.items || []).map(
          (comment) => comment && <Comment key={comment.id} comment={comment} />
        )}

        {/* Posted Date */}
        <Text style={{ color: "grey" }}>{post.createdAt}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
