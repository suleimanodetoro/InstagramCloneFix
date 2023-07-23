import {Image, Text, View, } from 'react-native';
import React from 'react';
import user from '../../assets/data/user.json';
import styles from './styles';
import Button from '../../components/Button/';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavigationProp } from '../../types/navigation';
import { Auth } from 'aws-amplify';

// import { useAuthenticator } from '@aws-amplify/ui-react-native';

const ProfileHeader = () => {
  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
    const navigation = useNavigation<ProfileNavigationProp>();
    return (
      <View style={styles.root}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          {/* Profile picture */}
          <Image source={{uri: user.image}} style={styles.avatar} />
  
          {/* Posts, Followers, Following */}
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>98</Text>
            <Text style={styles.metadataText}>Posts</Text>
          </View>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>150</Text>
            <Text style={styles.metadataText}>Followers</Text>
          </View>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>98</Text>
            <Text style={styles.metadataText}>Following</Text>
          </View>
        </View>
        {/* User Name */}
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text>{user.bio}</Text>
        </View>
  
        {/* Profile Buttons */}
  
        <View style={{flexDirection: 'row'}}>
          <Button
            text="Edit Profile"
            onPress={() => {
              //Call the screen name as declared in the profilestack navigator handling the naviagtion of profile screen, even though it is nested in bottom tab, which is in the index of the navigation
              navigation.navigate('Edit Profile');
            }}
          />
          <Button
            text="Log out"
            onPress={() => signOut()
            }
          />
        </View>
  
        
      </View>
    );
  };

  export default ProfileHeader