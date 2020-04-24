import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Alert,
} from 'react-native';
import {ListItem, Badge} from 'react-native-elements'
import {Txt, TxtBold} from '../../src/component/Text'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

import {style} from '../../assets/styles/Style'
import Global from '../config/Global'

export default class Profile extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isParentPerson: false,
            newRequestCount: 0,
        }

        this.getSession()
        this.hasMounted = false
    }

    componentDidMount() {
        this.hasMounted = true

        this.focusListener = [
            this.props.navigation.addListener('didFocus', () => {
                this.hasMounted && this.setState({newRequestCount: Global.badgeCount.state.count})
            }),
            this.props.navigation.addListener('willBlur', () => {
                // this.hasMounted ? this.setState({notificationCounter: 0}) : null
            })
        ]
    }

    componentWillUnmount() {
        this.hasMounted = false

        this.focusListener.forEach(listener => listener.remove())
    }

    getSession = async () => {
        let namaPegawai = await AsyncStorage.getItem('namaPegawai')
        // let posTitle = await AsyncStorage.getItem('posTitle')
        let parentName = await AsyncStorage.getItem('parentName')
        let isParentPerson = await AsyncStorage.getItem('isParentPerson')
        this.hasMounted && this.setState({namaPegawai: namaPegawai, parentName: parentName, isParentPerson: isParentPerson})
    }

    signOut = () => {
        Alert.alert(
            'Sign Out',
            'Anda yakin ingin keluar?',
            [
                {text: 'Batal'},
                {
                    text: 'OK',
                    onPress: async () => {
                        await AsyncStorage.multiRemove(['logged', 'nikSap', 'namaPegawai', 'parentId', 'parentName', 'accessToken', 'isParentPerson'])
                        this.props.navigation.navigate('authCheck')
                    }
                }
            ]
        )
    }

    render() {
        const menu = [
            {
                title: 'Persetujuan Request Order',
                icon: 'check-square',
                onPress: () => this.props.navigation.navigate('Approval'),
                display: this.state.isParentPerson == 'yes' ? 'flex' : 'none'
            }, {
                title: 'Ubah Password',
                icon: 'key',
                onPress: () => null,
                display: 'flex'
            }, {
                title: 'Sign Out',
                icon: 'log-out',
                onPress: () => this.signOut(),
                display: 'flex'
            }
        ]

        return (
            <View style={[style.mainContainer]}>
                <ImageBackground source={require('../../assets/images/3229330.jpg')} style={s.headerContainer} />
                <View style={s.bodyContainer}>
                    <Icon
                        name='user'
                        type='feather'
                        reverse
                        color='#fff'
                        reverseColor='#5794ff'
                        size={48}
                        containerStyle={s.profileIcon}
                        raised
                    />
                    <View style={s.contentContainer}>
                        <View style={s.profileDescContainer}>
                            <TxtBold style={s.name}>{ this.state.namaPegawai }</TxtBold>
                            <Txt style={s.posTitle}>{ this.state.parentName }</Txt>
                        </View>
                        {
                            menu.map((item, index) => {
                                let bottomDivider = parseInt(index + 1) == menu.length ? false : true
                                return (
                                    <TouchableOpacity>
                                        <ListItem
                                            key={index}
                                            title={
                                                index == 0 ? (
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <TxtBold style={{fontSize: 14}}>{item.title}</TxtBold>
                                                        {this.state.newRequestExist > 0 ? (<Badge status='error' value={this.state.newRequestCount} containerStyle={{position: 'absolute', right: 0}} />) : null}
                                                    </View>
                                                ) : (<TxtBold style={{fontSize: 14}}>{item.title}</TxtBold>)
                                            }
                                            titleStyle={{fontFamily: 'Product Sans Bold', color: 'rgba(0, 0, 0, .6)'}}
                                            leftIcon={<Icon name={item.icon} type='feather' color='#5794ff' />}
                                            bottomDivider={bottomDivider}
                                            onPress={item.onPress}
                                            style={{display: item.display}}
                                            chevron
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const s = StyleSheet.create({
    headerContainer: {
        height: 120,
        padding: 16,
        flexDirection: 'column',
        backgroundColor: '#5794ff'
    },
    bodyContainer: {
        padding: 16,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        borderTopEndRadius: 28,
        flexDirection: 'column',
        flex: 1,
    },
    profileIcon: {
        alignSelf: 'center',
        marginTop: -70
    },
    contentContainer: {
        // marginTop: 40
    },
    profileDescContainer: {
        alignItems: 'center',
        paddingBottom: 24,
    },
    name: {
        fontSize: 22,
        color: 'rgba(0, 0, 0, .6)',
    },
    posTitle: {
        color: 'rgba(0, 0, 0, .6)'
    },
})