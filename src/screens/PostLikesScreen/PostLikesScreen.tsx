import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { PostLikesRouteProp } from '../../types/navigation';
import { useQuery } from '@apollo/client';
import { LikesForPostByUser } from './queries';
import { LikesForPostByUserQuery, LikesForPostByUserQueryVariables } from '../../API';
import UserListItem from '../../components/UserListItem/UserListItem';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const PostLikesScreen = () => {
    const route = useRoute<PostLikesRouteProp>();
    const {id}= route?.params;
    console.log('post id',id);
    
    const {data, loading, error, refetch}= useQuery<LikesForPostByUserQuery,LikesForPostByUserQueryVariables>(LikesForPostByUser,{
        variables:{
            postID: id
        },
        errorPolicy:'all'
    })
    if (loading) {
        return <ActivityIndicator />
        
    }
    if (error) {
        return( <ApiErrorMessage title='Error fetching likes' message={error.message}/>)  
    }
    const likes = (data?.LikesForPostByUser?.items).filter(like => !like?._deleted) || [];
  return (
    <View>
      <FlatList data={likes} refreshing={loading} onRefresh={refetch} renderItem={({item})=> item && <UserListItem user={item.User} /> }/>
    </View>
  )
}

export default PostLikesScreen

const styles = StyleSheet.create({})