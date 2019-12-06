import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native';

import {style} from '../../assets/styles/Style';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component {
    signOut = async () => {
        await AsyncStorage.multiRemove(['logged', 'nikSap', 'unitId', 'isUnitHead']);
        this.props.navigation.navigate('authCheck');
    }

    render() {
        return (
            <View style={[style.mainContainer]}>
                <View style={s.container}>
                    <Text>Hehe profile yeu</Text>
                    <Button title="Sign Out" onPress={this.signOut} />
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