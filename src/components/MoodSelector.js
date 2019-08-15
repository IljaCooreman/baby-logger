/** @jsx jsx */
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';
import { css, jsx } from '@emotion/core'


const containerStyle = css`
  display: flex;
  margin: 20px 0 30px;
  flex-grow: 1;
  justify-content: center;
`

const buttonStyle = (isActive, loading, i, isOngoing) => css`
  position: relative;
  margin: 4px;
  width: 60px;
  height: 60px;
  font-size: 11px;
  border-radius: 50%;
  opacity: ${isOngoing ? 1 : 0};
  background: ${isActive ? '#FF8A1E' : 'rgba(255, 255, 255, .4)'};
  border: 2px solid ${isActive ? 'rgba(255, 255, 255, .6)' : 'rgba(255, 255, 255, .6)'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transform: scale(${loading ? .5 : 1}) translateY(${isOngoing ? i % 2 !== 0 ? 30 : 10 : 0}px);
  transition: transform .2s ease-out, opacity 1.2s ease-out;
  transition-delay: ${i * 50}ms;
`

export const Mood = {
  sleepy: { value: "SLEEPY", description: 'slaperig', icon: null },
  playful: { value: "PLAYFUL", description: 'spelen', icon: null },
  sad: { value: "SAD", description: 'droevig', icon: null },
}


const MoodSelector = ({ id, name, mood, isOngoing, setMood }) => {
  const [updateNapEvent, { loading, error }] = useMutation(UPDATE_MOOD_QUERY,
    {
      onCompleted(data) {
        setMood(data.updateNapEvent.mood);
      }
    }
  );

  const handleButtonClick = (selectedMood) => {
    updateNapEvent({
      variables: {
        id,
        mood: selectedMood === mood ? "UNDEFINED" : selectedMood
      }
    })
  }

  if (error) {
    return (<div css={containerStyle}>Er ging iets fout: ${error.message}</div>)
  }

  return (
    <div css={css`margin: 30px; color: white;`}>
      <div css={css`opacity: ${isOngoing ? 1 : 0};`}>Hoe voelde {name} zich bij het slapengaan?</div>
      <div css={containerStyle}>
        {
          Object.values(Mood).map((moodObj, i) => {
            return (
              <div
                css={buttonStyle(moodObj.value === mood, loading, i, isOngoing)}
                key={moodObj.value}
                onClick={() => handleButtonClick(moodObj.value)}>
                {moodObj.description}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MoodSelector;

export const UPDATE_MOOD_QUERY = gql`
  mutation updateNapEvent($id: ID!, $mood: Mood) {
    updateNapEvent(id: $id, mood: $mood ) {
      id
      status
      mood
    }
  }
`

