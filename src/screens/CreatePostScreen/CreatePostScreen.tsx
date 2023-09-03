import { StyleSheet, Text, View, Image, TextInput, Alert, } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { CreateNavigationProp, CreateRouteProp } from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button/Button'
VideoPlayer
import { createPost } from './queries';
import { useQuery, useMutation } from '@apollo/client';
import { CreatePostInput, CreatePostMutation, CreatePostMutationVariables } from '../../API';
import { useAuthContext } from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel/Carousel';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { Storage } from 'aws-amplify';



const CreatePostScreen = () => {
  //get signed in user from auth context
  const {userId} = useAuthContext();
  const [description, setDescription]= useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<CreateRouteProp>();
  const {image, video, images} = route.params;

  //conditionally render what was passed from route
  let content = null;
  if (image) {
    content = (
        <Image
          source={{
            uri: image ,
          }}
          style={styles.image}
        />
    );
  } else if (images) {
    content = <Carousel images={images}  />;
  } else if (video) {
    content = (
      <VideoPlayer
        uri={video}
      />
    );
  }
//Define function to receive every time you want to create a post. In this case, create a doReceivePost function
  const [doCreatePost] = useMutation<CreatePostMutation, CreatePostMutationVariables>(createPost);

  const submit = async () => {
    // return if already submitting
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    //create input variable
    const input: CreatePostInput = {
      type: "POST",
      description,
      //Will initially be set as undefined, but s3 keys will be assigned later
      //keys will then be used to access media
      image: undefined,
      images: undefined,
      video: undefined,
      nOfComments:0,
      nOfLikes: 0,
      userID: userId,

    };
    //check if image exists
    if (image) {
      //upload the media file to S3 and get the key using helper function defined below
    const imageKey = await uploadMedia(image);
    input.image = imageKey;
      
    }
    
    try {
      const response = await doCreatePost({
        variables:{ input},
        refetchQueries:["PostsByDate"]
      });
      console.log(response);
      // Set submitting state to false before leaving screen
      setIsSubmitting(false);
      //Go back to camera screen before navigating to homestack
      navigation.popToTop();
      navigation.navigate('HomeStack');
      
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error uploading post...',(error as Error).message)
      
    }
    
  }
  //upload media function
  const uploadMedia = async (uri: string) => {
    try {
      //Get file converted to blob format
      const response = await fetch(uri);
      const blob = await response.blob()

      //Upload blob format of file to S3
      const s3Response = await Storage.put("image.png",blob);
      console.log(s3Response);
      return s3Response.key;

      

      
    } catch (error) {
      Alert.alert((error as Error).message)
      
    }

  }
  
  return (
    <View style={styles.root}>
      <View style={styles.content}>
      {content}

      </View>
      
      <TextInput multiline value={description} onChangeText={setDescription} placeholder='Description...' style={styles.input}/>

      <Button text={isSubmitting ? 'Submiting...' : 'Submit' } onPress={submit}/>
    </View>
  )
}

export default CreatePostScreen

const styles = StyleSheet.create({
  root:{
    alignItems:"center",
    padding:10,
  },
  image:{
    width: '100%',
    aspectRatio: 1,
  },
  input:{
    //make it full width =>
    alignSelf:"stretch",
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,

  },
  content: {
    width: '100%',
    aspectRatio: 1,
  },
  progressContainer: {
    backgroundColor: colors.lightgrey,
    width: '100%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  progress: {
    backgroundColor: colors.primaryColor,
    position: 'absolute',
    height: '100%',
    alignSelf: 'flex-start',
    borderRadius: 25,
  },
})