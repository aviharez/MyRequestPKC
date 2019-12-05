import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import {style} from '../../assets/styles/Style';

export default class Profile extends Component {
    render() {
        return (
            <View style={[style.mainContainer]}>
                <View style={s.container}>
                    <Text>Hehe profile yeu</Text>
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