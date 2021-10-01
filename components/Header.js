import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { images, colors } from '../res';
import { CutomMenu } from './CustomMenu';
import BackgroundProgress from './BackgroundProgress';

export const Header = ({
  backgroundColor,
  title,
  contentType,
  onPressClose,
  url,
  openBrowserTitle,
  copyLinkTitle,
  extraMenuItems,
  backgroundProgressRefOnChange,
  canback,
  canForward,
  navigationVisible,
  onPressBack,
  onPressForward,
  closeIcon,
  menuIcon
}) => {
  let forward;
  let back;
  if (!canback) back = images.backDisabled;
  else if (contentType == 'light') back = images.backLight;
  else back = images.backDark;

  if (!canForward) forward = images.forwardDisabled;
  else if (contentType == 'light') forward = images.forwardLight;
  else forward = images.forwardDark
  return (
    <View
      style={[
        styles.container,
      ]}
      >
      <Icon
      onPress={onPressClose}
      content={images.closeLight}
      icon={closeIcon} />
    </View>
  );
};


const Icon = ({ onPress, content, icon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      {icon ||
        <Image
          source={content}
          style={styles.icon}
        />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    // height: Platform.OS == 'android' ? 50 : 30,
    zIndex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 32,
    height: 32,
    // position: Platform.OS == 'android' ? 'absolute' : 'relative',
    // top: Platform.OS == 'android' ? 15 : 0,
    zIndex: 999,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 5,
    
  },
  icon: {
    width: 20,
    height: 20,
    padding: 0,
    margin: 0
  },
  body: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: colors.lightGray,
    fontWeight: 'bold',
  },
});
