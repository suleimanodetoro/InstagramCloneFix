import { StyleSheet, Text, View,Image,Pressable } from 'react-native'
import React from 'react'
import { weight } from '../../theme/fonts';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { User } from '../../API';
import { DEFAULT_USER_IMAGE } from '../../config';

interface IUserListItem {
    user: User

}

const UserListItem = ({user}: IUserListItem) => {
    const navigation = useNavigation();

    const goToUserScreen= ()=>{
        navigation.navigate('UserProfile', {userId: user.id} )

    }
  return (
    <Pressable onPress={goToUserScreen} style={styles.root}>
      <Image style={styles.image} source={{uri: user.image || DEFAULT_USER_IMAGE}} />
      <View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>

      </View>
    </Pressable>
  )
}

export default UserListItem

const styles = StyleSheet.create({
    root:{
        flexDirection:'row',
        alignItems:'center',
        padding:10,
    },
    image:{
        width: 50,
        aspectRatio:1,
        borderRadius: 25,
        marginRight:10,

    },
    name:{
        fontWeight: weight.bold,
        margin:5,
    },
    username:{
        color: colors.grey,
    }
})