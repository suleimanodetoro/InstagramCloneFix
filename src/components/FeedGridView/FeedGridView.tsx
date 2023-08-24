import { StyleSheet, Text, View, FlatList,Image } from 'react-native'
import React from 'react'
import { Post } from '../../API';
import FeedGridItem from './FeedGridItem';
interface IFeedGridView {
    data: (Post | null)[];
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
    loading: boolean;
    refetch: ()=> void;

}

const FeedGridView = ({data,ListHeaderComponent, refetch, loading}: IFeedGridView) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => item && (
        <FeedGridItem post={item} />
        
      )}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      refreshing={loading}
      onRefresh={() => refetch()}
      
      

    />
  )
}

export default FeedGridView

const styles = StyleSheet.create({})