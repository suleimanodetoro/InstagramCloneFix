import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewabilityConfig, ViewToken,SafeAreaView, StatusBar
} from 'react-native';
import React,{useRef,useState} from 'react';
import FeedPost from '../../components/FeedPost/FeedPost';
import posts from '../../assets/data/posts.json';

const HomeScreen = (props) => {
  const [activePostId, setActivePostId] = useState < string | null > (null)
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
      keyExtractor={item => `post-${item.createdAt}-${item.user.username}`}
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged.current}
    />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
