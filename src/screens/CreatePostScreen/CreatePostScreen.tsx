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



const CreatePostScreen = () => {
  //get signed in user from auth context
  const {userId} = useAuthContext();
  const [description, setDescription]= useState('');

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
    try {
      const response = await doCreatePost({
        variables:{
          //input needed gotten from build>schema.graphql in amplify folder
          //when creating a post you do not need to add version.
          input:{
            description,
            image,
            images,
            video,
            nOfComments:0,
            nOfLikes: 0,
            userID: userId,
  
          }
        },
      });
      console.log(response);
      //Go back to camera screen before navigating to homestack
      navigation.popToTop();
      navigation.navigate('HomeStack');
      
    } catch (error) {
      Alert.alert('Error uploading post...',(error as Error).message)
      
    }
    
  }
  
  return (
    <View style={styles.root}>
      <View style={styles.content}>
      {content}

      </View>
      
      <TextInput multiline value={description} onChangeText={setDescription} placeholder='Description...' style={styles.input}/>

      <Button text={'Submit'} onPress={submit}/>
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