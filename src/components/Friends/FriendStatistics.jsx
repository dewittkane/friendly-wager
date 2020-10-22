import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import FriendStatisticsHeader from './FriendStatisticsHeader';



function FriendStatistics(props) {

  useEffect(() => {
    props.dispatch({type: 'FETCH_FRIEND_DETAILS', payload: props.match.params.id })
  }, []);

    return (
      <div>
        <FriendStatisticsHeader/>
      </div>
    );

}

export default connect(mapStoreToProps)(FriendStatistics);
