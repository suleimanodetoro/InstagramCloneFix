import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {size, weight} from '../../theme/fonts';

export default StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  textButton: {
    color: colors.primaryColor,
    fontSize: size.medium,
    fontWeight: weight.semi,

    margin: 10,
  },
  textButtonDanger: {
    color: colors.error,
    fontSize: size.medium,
    fontWeight: weight.semi,

    margin: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  label: {
    width: 75,
  },
  input: {
    borderBottomWidth: 1,
    minHeight: 50,
  },
});