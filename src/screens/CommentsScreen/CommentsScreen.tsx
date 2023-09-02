import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Comment from "../../components/Comment/";
import Input from "./Input";
import { useRoute } from "@react-navigation/native";
import { CommentsRouteProp } from "../../types/navigation";
import { commentsByPost, onCreateCommentByPostId } from "./queries";
import {
  Comment as CommentType,
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  ModelSortDirection,
  OnCreateCommentByPostIdSubscription,
  OnCreateCommentByPostIdSubscriptionVariables,
} from "../../API";
import { useQuery, useSubscription } from "@apollo/client";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";
import CommentService from "../../services/CommentService/CommentService";

const CommentsScreen = () => {
  const route = useRoute<CommentsRouteProp>();
  const { postId } = route?.params;
  //state to keep track of newly created posts
  const [newComment, setNewComment] = useState<CommentType[]>([]);
  

  //Add fetch More to Implement pagination, to load more pages
  const { data, loading, error, fetchMore } = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {
    variables: {
      postID: postId,
      sortDirection: ModelSortDirection.ASC,
      // Query 15 comments to start
      limit:15,
    },
    errorPolicy: "all",
  });
  //Create subscription to have the comment screen display real time data
  const {data: newCommentSubscriptionData, error: commentSubError, loading:commentSubLoadingState} = useSubscription<OnCreateCommentByPostIdSubscription,OnCreateCommentByPostIdSubscriptionVariables>(onCreateCommentByPostId, {variables:{postID: postId}});

    // useEffect to store the comment everytime new Comment Updates
    useEffect(() => {
      
      if (newCommentSubscriptionData?.onCreateCommentByPostId) {
        setNewComment((existingComments)=>([(newCommentSubscriptionData.onCreateCommentByPostId as CommentType),...existingComments]))
        
      }
    }, [newCommentSubscriptionData])

  // implement lloading state for fetch more function
  const [isFetchingMore, setFetchingMore] = useState(false);

  if (loading) {
    <ActivityIndicator />;
  }
  if (error) {
    <ApiErrorMessage title="Error fetching comments" message={error.message} />;
  }
  const comments = (data?.commentsByPost?.items || []).filter(
    (comment) => !comment._deleted
  );
  //Use this nextToken to get next batch of comments. Note that comments are limited to 3 per query.
  const nextToken = data?.commentsByPost.nextToken;
    //Function to load more comments
  const loadMoreComments = async ()=>{
    //Do not fetch more comments if token is empty or fetching state is true (meaning it is in progress)
    if (!nextToken || isFetchingMore) {
      console.log('Next token not available');
      return;
    }
    try {
      //This on its own won't be enough. You will need to edit client apollo file so it treat merges certain cached data.
      //See https://www.apollographql.com/docs/react/pagination/core-api/ 
      await fetchMore({variables:{nextToken}})
      
    } catch (error) {
      console.log('Fetching comment error', (error as Error).message);
    } finally {
      setFetchingMore(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...newComment,...comments]}
        renderItem={({ item }) => <Comment comment={item} includeDetails />}
        style={{ padding: 10 }}
        ListEmptyComponent={() => <Text>No comments here yet🤔</Text>}
        // On reaching the end of the list, load more comments
        onEndReached={()=> loadMoreComments()}
      />

      {/* Comment text field only visible in comment screen */}
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({});
