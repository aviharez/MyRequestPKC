import React, {Component} from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

export default class Card extends Component {
    render() {
        const {style, ...restProps} = this.props;
        return (
            <View style={[s.card, style]} {...this.restProps}>
                {this.props.children}
            </View>
        )
    }
}

const s = StyleSheet.create({
    card: {
        //backgroundColor: '#fff',
        minHeight: 40,
        padding: 12,
        borderRadius: 16,
        // margin: 4,
        // marginVertical: 56,
        // borderWidth: .8,
        // borderColor: 'rgba(0, 0, 0, .08)',

        // shadowColor: "#333",
        // shadowOffset: {
        //     width: 0,
        //     height: 8,
        // },
        // shadowOpacity: 0.18,
        // shadowRadius: 1.00,
        // elevation: 3,
    }
})