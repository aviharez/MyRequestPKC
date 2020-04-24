import React from 'react'
import {
    View,
    ActivityIndicator
} from 'react-native'
import Modal from 'react-native-modal'

const HEIGHT = Platform.OS == 'ios' ? Dimensions.get('window').height : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT')

export default class LoadingModal extends React.PureComponent {
    render() {
        return (
            <Modal isVisible={this.props.show} useNativeDriver={true} animationIn='zoomIn' animationOut='zoomOut' deviceHeight={HEIGHT} backdropOpacity={0.3}>
                <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 100, width: 100, backgroundColor: 'white', borderRadius: 24,}}>
                    <ActivityIndicator size='large' color='#666' />
                </View>
            </Modal>
        )
    }
}