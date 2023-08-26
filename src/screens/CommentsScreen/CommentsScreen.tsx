import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import comments from '../../assets/data/comments.json';
import Comment from '../../components/Comment/';
import Input from './Input';
import { useRoute } from '@react-navigation/native';
import { CommentsRouteProp } from '../../types/navigation';

const CommentsScreen = () => {
  const route = useRoute<CommentsRouteProp>();
  const {postId} = route?.params;
  return (
    <View style={{flex:1}}>
      <FlatList
        data={comments}
        renderItem={({item}) => <Comment comment={item} includeDetails/>}
        style={{padding:10}}
      />

      {/* Comment text field only visible in comment screen */}
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({});
