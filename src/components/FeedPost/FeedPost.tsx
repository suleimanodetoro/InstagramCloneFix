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
import { Post } from "../../API";

//import hook to enable naviagtion functionality
import { useNavigation } from "@react-navigation/native";
import { FeedNavigationProp } from "../../types/navigation";
import { DEFAULT_USER_IMAGE } from "../../config";

import PostMenu from "./PostMenu";

import { useAuthContext } from "../../contexts/AuthContext";
import useLikeService from "../../services/LikeService/LikeService";

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
  const { post } = props;
  const { isLiked, toggleLikeState } = useLikeService(post);
  const { isVisible } = props;
  const [descriptionExpended, setDescriptionExpanded] = useState(false);

  const postLikes = post?.Likes?.items.filter((like) => !like._deleted) || [];

  const naviagtion = useNavigation<FeedNavigationProp>();

  //naviagte to user porfile on clicking post username
  const navigateToUser = () => {
    if (post.User) {
      naviagtion.navigate("UserProfile", { userId: post.User?.id });
    }
  };

  const navigateToComments = () => {
    naviagtion.navigate("Comments", { postId: post.id });
  };

  const navigateToLikesPage = () => {
    naviagtion.navigate("PostLikes", { id: post.id });
  };

  //Expand description
  const toggleDescriptionExpansion = () => {
    setDescriptionExpanded((existingValue) => {
      return !descriptionExpended;
    });
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
              name={isLiked ? "heart" : "hearto"}
              size={24}
              style={styles.icon}
              color={isLiked ? colors.accent : colors.black}
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
        {/* Counting operation in dynamo db with scan operators can be very costly and slow
        What we are going to do is use the updatePost mutation to increase/decrese number of likes
        If post length is less than or equal to zero, display a simple text, else display the username. 
        If the post likes are more than 1, conditionally render "and other"        
        ... */}

        {postLikes.length <= 0 ? (
          <Text style={styles.text}>Be the first to like the post</Text>
        ) : (
          <Text style={styles.text} onPress={navigateToLikesPage}>
            Liked by{" "}
            <Text style={styles.bold}>{postLikes[0].User.username}</Text>
            {postLikes.length > 1 && (
              <>
                {" "}
                and <Text style={styles.bold}>
                  {post.nOfLikes - 1} others
                </Text>{" "}
              </>
            )}
          </Text>
        )}

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
