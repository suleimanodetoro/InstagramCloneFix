import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  CreateNavigationProp,
  CreateRouteProp,
  UpdatePostRouteProp,
} from "../../types/navigation";
import colors from "../../theme/colors";
import Button from "../../components/Button/Button";
import { updatePost, getPost } from "./queries";
import { useQuery, useMutation } from "@apollo/client";
import {
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../API";
import { useAuthContext } from "../../contexts/AuthContext";
import Carousel from "../../components/Carousel/Carousel";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";

const UpdatePostScreen = () => {
  //get signed in user from auth context
  const { userId } = useAuthContext();
  const [description, setDescription] = useState("");

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<UpdatePostRouteProp>();

  const { id } = route.params;
  //get latest version of post to update
  const { data, loading, error } = useQuery<
    GetPostQuery,
    GetPostQueryVariables
  >(getPost, {
    variables: { id },
  });
  //store the get request data
  const post = data?.getPost;
  //create function to execute mutation request
  const [doUpdatePost, {error:updateError,data:updatedData}, ] = useMutation<UpdatePostMutation,UpdatePostMutationVariables>(updatePost);
  //if post exists, display the old description in edit box
  useEffect(()=>{
    if (post) {
      setDescription(post.description+id);
    }
  },[post])

  //Check if data has been updated, go back to homescreen
  useEffect(()=>{
    if (updatedData) {      
      navigation.goBack();
    }
  }, [updatedData,navigation])

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error || updateError) {
    return (
      <ApiErrorMessage
        title="Error updating message"
        message={error.message || updateError.message}
      />
    );
  }

  const submit = async () => {
    if (!post) {
      return;
    }
    doUpdatePost({
      variables:{input:{id:post.id, _version:post._version, description}}
    })
    
  };

  return (
    <View style={styles.root}>
      <TextInput
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
      />

      <Button text={"Submit"} onPress={submit} />
    </View>
  );
};

export default UpdatePostScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  input: {
    //make it full width =>
    alignSelf: "stretch",
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
  content: {
    width: "100%",
    aspectRatio: 1,
  },
  progressContainer: {
    backgroundColor: colors.lightgrey,
    width: "100%",
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginVertical: 10,
  },
  progress: {
    backgroundColor: colors.primaryColor,
    position: "absolute",
    height: "100%",
    alignSelf: "flex-start",
    borderRadius: 25,
  },
});
