import {
  Image,
  InteractionManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {size, weight} from '../../theme/fonts';
import colors from '../../theme/colors';
import { Comment as CommentType} from '../../API';
import { DEFAULT_USER_IMAGE } from '../../config';
import CommentService from '../../services/CommentService/CommentService';
import dayjs from 'dayjs';


interface ICommentProps {
  comment: CommentType;
  includeDetails?: boolean; //Track if detailed comment screen items should rendered, or just normal texts (this is the case in home screen)
}

const Comment = ({comment, includeDetails = false}: ICommentProps) => {
  
  const {onDeleteOptionPressed} = CommentService(comment.postID, comment.id, comment._version);
  const [isLiked, setLikeState] = useState(false);
  const toggleLike = () => {
    setLikeState(v => !v);
  };
  return (
    <View style={styles.comment}>
      {/* comment user avater */}
      {includeDetails && (
        <Image source={{uri: comment.User?.image || DEFAULT_USER_IMAGE}} style={styles.avater} />
      )}

      {/* MiddleColumn containing comment text and metadata */}
      <View style={styles.middleColumn}>
        {/* Comment text */}
        <Text style={styles.commentText}>
          <Text style={styles.bold}>{comment.User?.username}</Text>{' '}
          {comment.comment}
        </Text>
        {/* Comment MetaData inside Comment Text Column */}
        {includeDetails && (
          <>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{dayjs(comment.createdAt).fromNow()}</Text>
            <Text style={styles.footerText}>5 Likes</Text>
            <Text style={styles.footerText}>Reply</Text>
          </View>
          <View style={styles.footer}>
              <Pressable style={styles.footerText} onPress={comment && onDeleteOptionPressed}>
                <Text>Delete</Text>
              </Pressable>
          </View>
          </>
          
          
        )}
      </View>

      {/* comment like button */}
      <Pressable onPress={toggleLike} hitSlop={2}>
        <AntDesign
          name={isLiked ? 'heart' : 'hearto'}
          size={size.default}
          style={styles.icon}
          color={isLiked ? colors.accent : colors.black}
        />
      </Pressable>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  avater: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
    marginRight: 5,

  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    flex: 1,
    color: colors.black,
  },
  icon: {
    marginHorizontal: 5,
  },
  bold: {
    fontWeight: weight.bold,
  },
  middleColumn: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    marginBottom:10
  },
  footerText: {
    marginRight: 5,
    color: 'grey',
  },
});
