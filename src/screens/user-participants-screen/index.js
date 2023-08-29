import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';
import { useOrientation } from '../../hooks/use-orientation';
import ScreenWrapper from '../../components/screen-wrapper';
import { selectWaitingUsers } from '../../store/redux/slices/guest-users';
import { selectMainUsers } from '../../store/redux/slices/users';
import { isModerator, selectCurrentUserId } from '../../store/redux/slices/current-user';
import { isBreakout } from '../../store/redux/slices/wide-app/client';
import UserParticipantsService from './service';
import Colors from '../../constants/colors';
import Styled from './styles';

const UserParticipantsScreen = () => {
  const usersStore = useSelector((state) => state.usersCollection);
  const amIModerator = useSelector(isModerator);
  const mainUsers = useSelector(selectMainUsers);
  const myUserId = useSelector(selectCurrentUserId);
  const pendingUsers = useSelector(selectWaitingUsers);
  const meetingIsBreakout = useSelector(isBreakout);

  const [showMenu, setShowMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

  const { t } = useTranslation();
  const orientation = useOrientation();
  const navigation = useNavigation();

  const handleUsersName = useCallback(
    () => mainUsers.map((user) => {
      return {
        name: user.name,
        role: user.role,
        color: user.color,
        userId: user.intId,
        // ...other properties
      };
    }),
    [mainUsers]
  );

  const onIconPress = (event, item, isMe) => {
    const { nativeEvent } = event;
    const anchor = {
      x: nativeEvent.pageX,
      y: nativeEvent.pageY - 150,
    };

    // disable dropdown if the user selected === isMe
    if (isMe) {
      return;
    }

    setSelectedUser(item);
    setMenuAnchor(anchor);
    setShowMenu(true);
  };

  const renderItem = ({ item }) => {
    const isMe = myUserId === item.userId;

    return (
      <Styled.CardPressable onPress={(e) => onIconPress(e, item, isMe)} isMe={isMe}>
        <Styled.UserAvatar
          userName={item.name}
          userRole={item.role}
          userColor={item.color}
        />
        <Styled.UserName numberOfLines={1}>{item.name}</Styled.UserName>
      </Styled.CardPressable>
    );
  };

  const renderGuestPolicy = () => (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate('GuestPolicyScreen');
        }}
      >
        <Styled.GuestMenuContainer>
          <Icon name="account-cog-outline" size={24} color={Colors.white} />
          <Styled.GuestPolicyText>{t('app.guest-policy.title')}</Styled.GuestPolicyText>
          <Styled.GuestPolicyIcon
            icon="arrow-right"
            iconColor={Colors.white}
          />
        </Styled.GuestMenuContainer>
      </Pressable>
      {pendingUsers.length > 0 && (
        <Pressable
          onPress={() => {
            navigation.navigate('WaitingUsersScreen');
          }}
        >
          <Styled.GuestMenuContainer>
            <Icon name="account-multiple-outline" size={24} color={Colors.white} />
            <Styled.GuestPolicyText>{t('mobileSdk.userList.waitingAtendees')}</Styled.GuestPolicyText>
            <Styled.GuestPolicyIcon
              icon="arrow-right"
              iconColor={Colors.white}
            />
          </Styled.GuestMenuContainer>
        </Pressable>
      )}
      <Styled.DividerTop />
    </>
  );

  const renderMenuView = () => {
    const isViewer = selectedUser.role === 'VIEWER';

    return (
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={menuAnchor}
      >
        {amIModerator
          && (
            <Menu.Item
              onPress={() => {
                UserParticipantsService.handleChangeRole(selectedUser.userId, selectedUser.role);
                setShowMenu(false);
              }}
              title={isViewer ? t('app.userList.menu.promoteUser.label') : t('app.userList.menu.demoteUser.label')}
            />
          )}
      </Menu>
    );
  };

  return (
    <ScreenWrapper>
      <Provider>
        <Styled.ContainerView orientation={orientation}>
          <Styled.Block orientation={orientation}>
            {amIModerator && !meetingIsBreakout && renderGuestPolicy()}
            <Styled.FlatList data={handleUsersName()} renderItem={renderItem} />
            {renderMenuView()}
          </Styled.Block>
        </Styled.ContainerView>
      </Provider>
    </ScreenWrapper>
  );
};

export default UserParticipantsScreen;
