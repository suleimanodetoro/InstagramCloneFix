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
import { postsByDate } from './queries';
import { ModelSortDirection, PostsByDateQuery, PostsByDateQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';



const HomeScreen = (props) => {
  const [activePostId, setActivePostId] = useState < string | null > (null);
  const [isFetchingMore, setIsFetching] = useState(false);
  const {data, loading, error, refetch, fetchMore} = useQuery<PostsByDateQuery,PostsByDateQueryVariables >(postsByDate, {
    errorPolicy: 'all',
    variables:{
      type:"POST",
      sortDirection: ModelSortDirection.DESC,
      limit:10
    }
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
    console.log('Error loading Post: HomeScreen ');
    
    return (<ApiErrorMessage title='Error fetching Post' message={error.message} onRetry={()=>refetch()}/>)
  };
  
  //Filter deleted posts
  const posts = (data?.postsByDate?.items).filter(post => !post?._deleted ) || [];
  const nextToken = data?.postsByDate?.nextToken;
  //Helper function to load more post items as you scroll
  const loadMorePost = async () =>{
    try {
      if (!nextToken || isFetchingMore) {
        console.log('No more posts !!');
        
        return;
      }
      setIsFetching(true);
      console.log('Loading more posts');
      await fetchMore({variables:{nextToken}})
      
    } catch (error) {
      console.log('Error occured while paging feed posts',(error as Error).message);  
    } finally {
      setIsFetching(false);
    }
     
  }
  

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
      keyExtractor={(item, index) => `post-${item.createdAt}-${item.id}-${index}`}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
      onEndReached={loadMorePost}
    />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
