import { KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useOrientation } from '../../../hooks/use-orientation';
import { isPresenter } from '../../../store/redux/slices/current-user';
import { setProfile } from '../../../store/redux/slices/wide-app/modal';
import ScreenWrapper from '../../../components/screen-wrapper';
import PreviousPollCard from './poll-card';
import Styled from './styles';

const PreviousPollScreen = () => {
  const { t } = useTranslation();
  const orientation = useOrientation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const previousPollPublishedStore = useSelector((state) => state.previousPollPublishedCollection);
  const amIPresenter = useSelector(isPresenter);

  if (Object.keys(previousPollPublishedStore.previousPollPublishedCollection)
    .length === 0) {
    return (
      <ScreenWrapper>
        <Styled.ContainerCentralizedView>
          <Styled.NoPollsImage
            source={require('../../../assets/application/service-off.png')}
            resizeMode="contain"
            style={{ width: 173, height: 130 }}
          />
          <Styled.NoPollsLabelTitle>
            {t('mobileSdk.poll.noPollsTitle')}
          </Styled.NoPollsLabelTitle>
          <Styled.NoPollsLabelSubtitle>
            {t('mobileSdk.poll.noPollsSubtitle')}
          </Styled.NoPollsLabelSubtitle>
          <Styled.ButtonContainer>
            <Styled.PressableButton
              onPress={() => navigation.navigate('CreatePollScreen')}
              onPressDisabled={() => dispatch(
                setProfile({
                  profile: 'create_poll_permission',
                })
              )}
              disabled={!amIPresenter}
            >
              {t('mobileSdk.poll.createLabel')}
            </Styled.PressableButton>
          </Styled.ButtonContainer>
        </Styled.ContainerCentralizedView>
      </ScreenWrapper>

    );
  }

  const renderMethod = () => {
    const invertPublishedPolls = Object.values(
      previousPollPublishedStore.previousPollPublishedCollection
    ).reverse();

    return (
      invertPublishedPolls.map((pollObj) => <PreviousPollCard pollObj={pollObj} key={pollObj.id} />)
    );
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Styled.ContainerView orientation={orientation}>
          <Styled.ContainerPollCard>
            <Styled.ContainerViewPadding>
              <>
                {renderMethod()}
              </>
            </Styled.ContainerViewPadding>
          </Styled.ContainerPollCard>
        </Styled.ContainerView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default PreviousPollScreen;
