import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
} from 'react-native';

import {style} from '../../assets/styles/Style';

export default class Notification extends Component {
    render() {
        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>

                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const s = StyleSheet.create({
    headerContainer: {
        height: 200,
        padding: 16,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#5794ff'
        // borderWidth: 1,
        // borderColor: 'red',
    },
    hdeaderSearchbar: {
        flex: 1,
        flexDirection: 'row'
    },
    headerUser: {
        width: 48,
        height: 48,
    },
    headerText: {
        fontSize: 20,
        width: 250,
        flex: 2,
        color: '#fff',
        top: 16,
        fontWeight: 'bold'
    },
})