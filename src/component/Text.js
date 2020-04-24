import React from 'react'
import {Text, StyleSheet} from 'react-native'

export class Txt extends React.PureComponent {
    render() {
        // const below means separating style props and creating new props named withoutStyle without style props included
        const {style, ...withoutStyle} = this.props
        return (
            // style below means combining 2 styles, one from this class and the withoutStyle is from rendered component
            <Text {...withoutStyle} style={[s.txt, style]}>{this.props.children}</Text>
        )
    }
}

export class TxtBold extends React.PureComponent {
    render() {
        const {style, ...withoutStyle} = this.props
        return (
            <Text {...withoutStyle} style={[s.txtBold, style]}>{this.props.children}</Text>
        )
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