import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import {style} from '../../../assets/styles/Style';

export default class Atk extends React.PureComponent {
    render() {
        return (
            <View style={[style.mainContainer]}>
                <View style={s.container}>
                    <Text>Hehe ATK yeu</Text>
                </View>
            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        padding: 16,
    }
})