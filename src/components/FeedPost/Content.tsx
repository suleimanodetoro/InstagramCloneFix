import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Post } from "../../API";
import DoublePressable from "../DoublePressable/DoublePressable";
import Carousel from "../Carousel/";
import VideoPlayer from "../VideoPlayer/";
import styles from "./styles";
import useLikeService from "../../services/LikeService";
import { Storage } from "aws-amplify";
interface IContent {
  post: Post;
  isVisible: boolean;
}
const Content = ({ post, isVisible }: IContent) => {
  const { isLiked, toggleLikeState } = useLikeService(post);
  const [imageUri, setImageUri] = useState<String | null>(null);
  //call the download functiononce the component is mounted
  useEffect(() => {
    downloadMedia();
  }, []);
  const downloadMedia = async () => {
    if (post.image) {
      //Return uri of image from s3 bucket using key
      const uri = await Storage.get(post.image);
      setImageUri(uri);
      return uri;
    }
  };

  if (post.image) {
    return (
      <DoublePressable onDoublePress={toggleLikeState}>

        <Image
          source={{
            // Is post.image an actual url or a key, render conditionally
            uri: post.image.startsWith('http') ? post.image : imageUri,
          }}
          style={styles.image}
        />
      </DoublePressable>
    );
  } else if (post.images) {
    return <Carousel images={post.images} onDoublePress={toggleLikeState} />;
  } else if (post.video) {
    return (
      <VideoPlayer
        uri={post.video}
        paused={!isVisible}
        onDoublePress={toggleLikeState}
      />
    );
  }
  return (
    <ActivityIndicator/>
  );
};

export default Content;
