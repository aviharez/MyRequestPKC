import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';

export class Txt extends Component {
    render() {
        // const below means separating style props and creating new props named withoutStyle without style props included
        const {style, ...withoutStyle} = this.props;
        return (
            // style below means combining 2 styles, one from this class and the withoutStyle is from rendered component
            <Text style={[s.txt, style]} {...this.withoutStyle}>{this.props.children}</Text>
        );
    }
}

export class TxtBold extends Component {
    render() {
        const {style, ...withoutStyle} = this.props;
        return (
            <Text style={[s.txtBold, style]} {...this.withoutStyle}>{this.props.children}</Text>
        );
    }
}

const s = StyleSheet.create({
    txt: {
        fontFamily: 'Product Sans',
        color: 'rgba(51, 51, 51, .9)',
    },
    txtBold: {
        fontFamily: 'Product Sans Bold',
        color: 'rgba(51, 51, 51, .9)',
    }
})