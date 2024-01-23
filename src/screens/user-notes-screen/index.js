import { View, Pressable, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { trigDetailedInfo, setDetailedInfo } from '../../store/redux/slices/wide-app/layout';
import makeCall from '../../services/api/makeCall';
import { selectPadSession } from '../../store/redux/slices/pads-sessions';
import ScreenWrapper from '../../components/screen-wrapper';

const UserNotesScreen = () => {
  const sessionToken = useSelector((state) => state.client.meetingData.sessionToken);
  const padSession = useSelector(selectPadSession);
  const host = useSelector((state) => state.client.meetingData.host);

  const [padId, setPadId] = useState('');
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

  const dispatch = useDispatch();

  const url = `https://${host}/pad/auth_session?padName=${padId}&sessionID=${padSession}&lang=pt-br&rtl=false&sessionToken=${sessionToken}`;

  useFocusEffect(useCallback(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []));

  const getPadId = () => {
    makeCall('getPadId', 'notes').then((response) => {
      if (response) {
        setPadId(response[0]);
      }
    });
  };

  const createSession = () => {
    makeCall('createSession', 'notes');
  };

  useEffect(() => {
    if (keyboardIsVisible) {
      dispatch(setDetailedInfo(false));
    }
  }, [keyboardIsVisible]);

  useEffect(() => {
    createSession();
    getPadId();
  }, []);

  return (
    <ScreenWrapper renderWithView>
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: url }} />
        {!keyboardIsVisible
        && <Pressable style={{ height: 100 }} onPress={() => dispatch(trigDetailedInfo())} />}
      </View>
    </ScreenWrapper>
  );
};

export default UserNotesScreen;
