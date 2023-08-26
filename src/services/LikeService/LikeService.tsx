import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteCommentMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  Post,
  UpdatePostMutation,
  UpdatePostMutationVariables,
  UsersByUsernameQuery,
  UsersByUsernameQueryVariables,
} from "../../API";
import { useMutation, useQuery } from "@apollo/client";
import {
  LikesForPostByUser,
  createLike,
  updatePost,
  deleteLike,
} from "./queries";
import { useAuthContext } from "../../contexts/AuthContext";
//Create custom hook to access certain like functions
const useLikeService = (post: Post) => {
  //Get logge din user id
  const { userId } = useAuthContext();

  //query to check posts liked by a user
  //Created by adding query field in schema.graphql
  // usersLikeData will be created for every post
  const {
    data: usersLikeData,
    loading,
    error,
  } = useQuery<LikesForPostByUserQuery, LikesForPostByUserQueryVariables>(
    LikesForPostByUser,
    {
      variables: {
        postID: post.id,
        userID: {
          //eq is an equal operation
          eq: userId,
        },
      },
    }
  );
  //store likes that are not deleted
  const userLike = (usersLikeData?.LikesForPostByUser?.items || []).filter(
    (likes) => !likes?._deleted
  )[0];
  //function to use updatePost mutation to increae/decrese like count
  const [doUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  //function for like mutation
  const [doCreateLike, { error: createLikeError }] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {
    variables: {
      input: { userID: userId, postID: post.id },
      //anytime a like is created, run the query already defined again to make sure likes show as soon as they are created
    },
    refetchQueries: ["LikesForPostByUser"],
  });
  //function to delete the like of a post
  const [doDeleteLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike);

  //helper function to increment likes. Only acceptable inputs are 1 and -1
  const manipulateLikeCount = (amount: 1 | -1) => {
    doUpdatePost({
      variables: {
        input: {
          id: post.id,
          _version: post._version,
          nOfLikes: post.nOfLikes + amount,
        },
      },
    });
  };

  const onAddLike = () => {
    doCreateLike();
    manipulateLikeCount(1);
  };

  const onDeleteLike = () => {
    //if user like is null, return
    if (!userLike) {
      return;
    }
    doDeleteLike({
      variables: {
        input: {
          id: userLike.id,
          _version: userLike._version,
        },
      },
    });
    //Decrese post like count
    manipulateLikeCount(-1);
  };

  const toggleLikeState = () => {
    if (userLike) {
      onDeleteLike();
    } else {
      onAddLike();
    }
  };

  // The hook will return an object with the following data
  return {
    manipulateLikeCount,
    toggleLikeState,
    isLiked: !!userLike,
  };
};
export default useLikeService;
