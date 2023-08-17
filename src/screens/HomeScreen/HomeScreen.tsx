import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewabilityConfig, ViewToken,SafeAreaView, StatusBar
} from 'react-native';
import React,{useRef,useState, useEffect} from 'react';
import FeedPost from '../../components/FeedPost/FeedPost';
import {graphqlOperation, API} from 'aws-amplify';


export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        image
        video
        images
        nOfComments
        nOfLikes
        userID
        User {
          id
          name
          username
          image
        }
        Comments {
          items {
            id
            comment
            User {
              id
              name
              username
            }
          }
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;

const HomeScreen = (props) => {
  const [activePostId, setActivePostId] = useState < string | null > (null);
  //state variable to store post data requested from database
  const [posts, setPosts] = useState([])
  // graphql request to query database

  const fetchPost = async() =>{    
    const response = await API.graphql(graphqlOperation(listPosts));    
    setPosts(response.data.listPosts.items)

  }

  useEffect(() => {
    fetchPost();
  }, []);
  



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
  

  return (
    <SafeAreaView>
        <StatusBar
          barStyle="dark-content"
        />
    <FlatList
      data={posts}
      renderItem={({item}) => <FeedPost post={item} isVisible={activePostId === item.id} />}
      keyExtractor={item => `post-${item.createdAt}-${item.User?.username}`}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
