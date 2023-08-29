import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Styled from './styles';
import { trigDetailedInfo } from '../../../../store/redux/slices/wide-app/layout';

const PreviousPollCard = (props) => {
  const { pollObj } = props;
  const timestamp = new Date(parseInt(pollObj.id.split('/')[2], 10));
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const noPollLocale = pollObj?.questionType === 'CUSTOM' || pollObj?.questionType === 'R-';

  return (
    <Styled.ContainerPollCard onPress={() => dispatch(trigDetailedInfo())}>
      <Styled.QuestionText>
        {pollObj.questionText === ''
          ? t('mobileSdk.poll.noQuestionTextProvided')
          : pollObj.questionText}
      </Styled.QuestionText>
      <Styled.TimestampText>
        {`${String(timestamp.getHours()).padStart(2, '0')}:${String(
          timestamp.getMinutes()
        ).padStart(2, '0')}`}
      </Styled.TimestampText>
      {pollObj.answers.map((answer) => (
        <View key={answer.id}>
          <Styled.AnswerContainer>
            <Styled.KeyText>
              {noPollLocale ? answer.key : t(`app.poll.answer.${answer.key}`.toLowerCase())}
              {' '}
              :
              {' '}
            </Styled.KeyText>
            <Styled.KeyText>
              {(pollObj.numResponders === 0
                ? 0
                : (answer.numVotes / pollObj.numResponders) * 100).toFixed(0)}
              %
            </Styled.KeyText>
          </Styled.AnswerContainer>
        </View>
      ))}
    </Styled.ContainerPollCard>
  );
};

export default PreviousPollCard;
