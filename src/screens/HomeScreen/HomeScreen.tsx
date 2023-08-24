import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewabilityConfig,SafeAreaView, StatusBar, ActivityIndicator
} from 'react-native';
import React,{useRef,useState} from 'react';
import FeedPost from '../../components/FeedPost/FeedPost';

/**
 * Instead of of using AppSync library, use the apollo library gql
 */
import {useQuery} from '@apollo/client';
import { listPosts } from './queries';
import { ListPostsQuery, ListPostsQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';



const HomeScreen = (props) => {
  const [activePostId, setActivePostId] = useState < string | null > (null);
  const {data, loading, error, refetch} = useQuery<ListPostsQuery,ListPostsQueryVariables >(listPosts, {
    errorPolicy: 'all',
  });

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 55, // do x when component is 50% visible
  };
  // Everytime the flatlist component is rerendered, the following function is recreated.
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newActivePostId = viewableItems[0].item.id;
      setActivePostId(prevActivePostId => {
        if (prevActivePostId !== newActivePostId) {
          return newActivePostId;
        }
        return prevActivePostId;
      });
    }
  });
  if (loading) {
    return <ActivityIndicator/>;
    
  }
  if (error) {
    console.log('erorrrr occuredddd');
    
    return (<ApiErrorMessage title='Error fetching Post' message={error.message} onRetry={()=>refetch()}/>)
  };
  
  //Filter deleted posts
  const posts = (data?.listPosts?.items).filter(post => !post?._deleted) || [];
  

  return (
    <SafeAreaView>
        <StatusBar
          barStyle="dark-content"
        />
    <FlatList
      data={posts}
      renderItem={({item}) => item && <FeedPost post={item} isVisible={activePostId === item.id} />}
      onRefresh={() => refetch()}
      refreshing={loading}
      keyExtractor={item => `post-${item.createdAt}-${item.id}`}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
