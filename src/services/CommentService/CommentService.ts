import { useMutation, useQuery } from "@apollo/client";
import {
  Comment,
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from "../../API";
import {
  commentsByPost,
  createComment,
  deleteComment,
  getPost,
  updatePost,
} from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";
import { ActivityIndicator, Alert, Text } from "react-native";
import ApiErrorMessage from "../../components/ApiErrorMessage/ApiErrorMessage";
import { useEffect } from "react";


const CommentService = (postId: string, commentId?: string, _version?:number ) => {
  const { userId } = useAuthContext();
  const {
    data: postData,
    error,
    loading,
  } = useQuery<GetPostQuery, GetPostQueryVariables>(getPost, {
    variables: { id: postId },
    errorPolicy: "all",
  });
  const { data: commentData } = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, { variables: { postID: postId } });

  const post = postData?.getPost;
  //function to use updatePost mutation to increae/decrese comment count
  const [doUpdateComment] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  //function to create comment
  const [doCreateComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment, { refetchQueries: ["CommentsByPost"] });

  const [doDeleteComment] = useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(deleteComment);

  // const [doDeleteComment]= useMutation<DeleteCommentMutation,DeleteCommentMutationVariables>(deleteComment,{variables:{input:{id:post.Comments}}})

  //Calling create comment
  const onCreateComment = async (newComment: string) => {
    try {
      await doCreateComment({
        variables: {
          input: {
            userID: userId,
            postID: post.id,
            comment: newComment,
          },
        },
        // From the query file, you cansee the name of the query responsible for for getting all comments
        //Refetch everytime a comment is created to update the display
        refetchQueries: ["CommentsByPost", "ListPosts"],
      });
      manipulateCommentCount(1);
    } catch (error) {
      Alert.alert("Error uploading comment", (error as Error).message);
    }
  };
  //Alert on DELETE PRESSED
  const onDeleteOptionPressed = () => {
    console.log('Delete comment called');
    
    //Confirm the user actually wants to delete the post
    Alert.alert("Are you sure ?", "Deleting a comment is permernent.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete Comment",
        style: "destructive",
        onPress: startDeletingComment,
      },
    ]);
  }

  // delete comment
  const startDeletingComment = async () => {
    try {
      await doDeleteComment({
        variables: {
          input: {
            id: commentId,
            _version: _version,
          },
        },
        refetchQueries: ["CommentsByPost"],
      });
      manipulateCommentCount(-1);
    } catch (error) {
      Alert.alert("Error deleting comment", (error as Error).message);
    }
  };

  //helper function to increment likes. Only acceptable inputs are 1 and -1
  const manipulateCommentCount = (amount: 1 | -1) => {
    if (!post) {
      Alert.alert("Failed to load post");
      return;
    }
    doUpdateComment({
      variables: {
        input: {
          id: postId,
          _version: post._version,
          nOfComments: post.nOfComments + amount,
        },
      },
    });
  };

  return {
    onDeleteOptionPressed,
    onCreateComment,
  };
};

export default CommentService;
