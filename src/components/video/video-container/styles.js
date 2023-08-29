import styled from 'styled-components/native';
import { css } from 'styled-components';
import { RTCView } from 'react-native-webrtc';
import { ActivityIndicator } from 'react-native-paper';
import IconButtonComponent from '../../icon-button';
import Colors from '../../../constants/colors';
import Pressable from '../../pressable';

const ContainerPressable = styled(Pressable).attrs(() => ({
  pressStyle: {
    opacity: 0.8,
    borderWidth: 2,
  },
}))`
  ${() => css`
    height: 120px;
    width: 120px;
    border-color: ${Colors.white};
    border-width: 2px;
    ${({ isTalking }) => isTalking && `
      border: 2px ${Colors.orange} solid;
    `}
    ${({ isGrid }) => isGrid && `
      border-color: #06172A;
    `}
  `}
`;

const UserAvatar = styled.Image`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const VideoStream = styled(RTCView)`
  position: relative;
  width: 100%;
  height: 100%;
  // overflow: hidden;
  object-fit: contain;
  background-color: ${Colors.contentLetterboxColor};

  ${({ isGrid }) => isGrid && `
    object-fit: cover;
  `}
`;

const UserColor = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ userColor, isGrid }) => userColor + (isGrid && 'AA')};
  overflow: hidden;

  ${({ isGrid }) => isGrid && `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const NameLabelContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #28282d99;
  padding: 5px;
  margin: 5px;
  border-radius: 4px;
`;
const NameLabel = styled.Text`
  color: ${Colors.white};
`;

const VideoSkeleton = () => (
  <ActivityIndicator
    size="large"
    color="white"
    backgroundColor={Colors.contentLetterboxColor}
    animating="true"
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  />
);

const ContainerPressableGrid = styled.Pressable`
    height: 120px;
    width: 120px;
    border-color: #06172A;
    border-width: 2px;
    ${({ isTalking }) => isTalking && `
      border: 2px ${Colors.orange} solid;
    `}
  `;

const PressableButton = styled(Pressable).attrs(() => ({
  pressStyle: {
    opacity: 0.8,
  },
}))`
  ${() => css`
    background-color: #28282d99;
    margin: 5px;
    border-radius: 4px;
    position: absolute;
    right: 0;
  `}
`;

const TalkingIndicatorContainer = styled.View`
    background-color: #28282d99;
    margin: 5px;
    border-radius: 20px;
    position: absolute;
    left: 0;
`;

const FullscreenIcon = styled(IconButtonComponent)`
  padding: 0;
  margin: 0;
`;

export default {
  ContainerPressable,
  UserAvatar,
  NameLabel,
  NameLabelContainer,
  PressableButton,
  UserColor,
  VideoStream,
  VideoSkeleton,
  ContainerPressableGrid,
  FullscreenIcon,
  TalkingIndicatorContainer,
};
