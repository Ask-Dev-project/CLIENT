import PropTypes from 'prop-types'

export default PropTypes.shape({
  localParticipant: participantPropType.isRequired,
  participants: PropTypes.instanceOf(Map).isRequired
})
