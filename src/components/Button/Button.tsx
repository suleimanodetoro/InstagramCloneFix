import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../theme/colors';
import { weight } from '../../theme/fonts';
interface IButton {
    text?: string;
    onPress?: ()=>void;
    inline?: boolean
}

const Button = ({text="", onPress=()=>{}, inline=false }: IButton) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, inline ? {flex:1} : {}]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
    container:{
        borderWidth:1,
        borderColor: colors.black,
        borderRadius:5,
        padding:5,
        margin:5,
        alignItems:"center",
        
    },
    text:{
        color: colors.black,
        fontWeight: weight.semi,
        
    },
})