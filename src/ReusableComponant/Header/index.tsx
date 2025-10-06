import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Box, Text, TouchableBox} from '../../Theme';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../Constant/Image';

type Props = {};

const Header = (props: Props) => {
  const navigation = useNavigation();
  return (
    <TouchableBox onPress={() => navigation?.goBack()}>
      <Box
        flexDirection="row"
        pl="l"
        paddingVertical="m"
        backgroundColor={'white'}
        alignItems="center">
        <Image source={Images.Left} />
        <Text variant={'Black20Regular'}>{props?.title}</Text>
      </Box>
    </TouchableBox>
  );
};

export default Header;

const styles = StyleSheet.create({});
