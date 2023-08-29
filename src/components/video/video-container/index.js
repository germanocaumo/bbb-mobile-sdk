import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  setFocusedElement,
  setFocusedId,
  trigDetailedInfo,
  setIsFocused
} from '../../../store/redux/slices/wide-app/layout';
import { isTalkingByUserId } from '../../../store/redux/slices/voice-users';
import { selectMetadata } from '../../../store/redux/slices/meeting';
import SoundWaveAnimation from '../../animations/sound-wave-animation';
import UserAvatar from '../../user-avatar';
import VideoManager from '../../../services/webrtc/video-manager';
import Styled from './styles';

const VideoContainer = (props) => {
  const {
    cameraId,
    userId,
    userAvatar,
    userColor,
    userName,
    style,
    local,
    visible,
    isGrid,
    userRole,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const detailedInfo = useSelector((state) => state.layout.detailedInfo);
  const clientIsReady = useSelector(({ client }) => {
    return client.connectionStatus.isConnected
      && client.sessionState.connected
      && client.sessionState.loggedIn;
  });
  const mediaStreamId = useSelector((state) => state.video.videoStreams[cameraId]);
  const signalingTransportOpen = useSelector((state) => state.video.signalingTransportOpen);
  const isTalking = useSelector((state) => isTalkingByUserId(state, userId));
  const mediaServer = useSelector((state) => selectMetadata(state, 'media-server-video'));

  useEffect(() => {
    if (signalingTransportOpen && clientIsReady) {
      if (cameraId && !local) {
        if (!mediaStreamId && visible) {
          VideoManager.subscribe(cameraId, { mediaServer });
        }

        if (mediaStreamId && !visible) {
          VideoManager.unsubscribe(cameraId);
        }
      }
    }
  }, [clientIsReady, cameraId, mediaStreamId, signalingTransportOpen, visible]);

  const renderVideo = () => {
    if (cameraId && visible) {
      if (typeof mediaStreamId === 'string') return <Styled.VideoStream streamURL={mediaStreamId} isGrid={isGrid} />;
      return <Styled.VideoSkeleton />;
    }

    return (
      <Styled.UserColor userColor={userColor} isGrid={isGrid}>
        {isGrid && (
        <UserAvatar
          userName={userName}
          userColor={userColor}
          userImage={userAvatar}
          isTalking={isTalking}
          userRole={userRole}
        />
        )}
      </Styled.UserColor>
    );
  };

  const handleFullscreenClick = () => {
    if (typeof mediaStreamId === 'string') {
      dispatch(setFocusedId(mediaStreamId));
      dispatch(setFocusedElement('videoStream'));
    } else if (userAvatar && userAvatar.length !== 0) {
      dispatch(setFocusedId(userAvatar));
      dispatch(setFocusedElement('avatar'));
    } else {
      dispatch(setFocusedId({
        userName, userColor, isTalking, userRole
      }));
      dispatch(setFocusedElement('color'));
    }

    dispatch(setIsFocused(true));
    navigation.navigate('FullscreenWrapperScreen');
  };

  const renderGridVideoContainerItem = () => (
    <Styled.ContainerPressableGrid
      onPress={() => {
        dispatch(trigDetailedInfo());
      }}
      style={style}
      userColor={userColor}
    >
      {renderVideo()}

      {/* always show talking indicator */}
      {isTalking && (
      <Styled.TalkingIndicatorContainer>
        <SoundWaveAnimation />
      </Styled.TalkingIndicatorContainer>
      )}

      {detailedInfo && (
        <>
          <Styled.NameLabelContainer>
            <Styled.NameLabel numberOfLines={1}>{userName}</Styled.NameLabel>
          </Styled.NameLabelContainer>

          <Styled.PressableButton
            activeOpacity={0.6}
            onPress={handleFullscreenClick}
          >
            <Styled.FullscreenIcon
              icon="fullscreen"
              iconColor="white"
              size={16}
              containerColor="#00000000"
            />
          </Styled.PressableButton>
        </>
      )}
    </Styled.ContainerPressableGrid>
  );

  return (
    renderGridVideoContainerItem()
  );
};

export default VideoContainer;
