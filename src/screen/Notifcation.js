import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import {ListItem} from 'react-native-elements';

import {style} from '../../assets/styles/Style';

import {TxtBold} from '../component/Text'; 

export default class Notification extends React.PureComponent {

    _isMounted = false;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const notif = [
            {
                id: '1',
                title: 'Requestmu telah mendapat persetujuan',
                date: 'today'
            }, {
                id: '2',
                title: 'Ada request baru untukmu. Cek sekarang juga',
                date: 'yesterday'
            }, {
                id: '3',
                title: 'Yaahh requestmu ditolak',
                date: '12 Des 2019'
            }
        ]

        return (
            <View style={[style.mainContainer, { backgroundColor: '#fff' }]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <View style={{  flex: 2 }} />
                            <TxtBold style={s.headerText}>Notifications</TxtBold>
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{marginTop: 24, marginLeft: 16}}>
                                {
                                    notif.map((item, index) => {
                                        let topDivider = index == 0 ? false : true
                                        return (
                                            <TouchableOpacity>
                                                <ListItem
                                                    key={Math.random()}
                                                    title={item.title}
                                                    titleStyle={{fontFamily: 'Product Sans Bold', fontSize: 14, color: 'rgba(0, 0, 0, .6)', marginLeft: -8}}
                                                    subtitle={item.date}
                                                    subtitleStyle={{ fontFamily: 'Product Sans', color: '#cccbc7', fontSize: 12, marginLeft: -8}}
                                                    leftAvatar={{ source: require('../../assets/icons/user.png'), height: 28, width: 28, marginLeft: -16 }}
                                                    topDivider={topDivider}
                                                    style={{ margin: -4, marginTop: -4 }}
                                                />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const s = StyleSheet.create({
    headerContainer: {
        height: 170,
        padding: 16,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#5794ff'
        // borderWidth: 1,
        // borderColor: 'red',
    },
    headerBackIcon: {
        fontSize: 24,
        color: '#fff',
    },
    headerText: {
        fontSize: 24,
        width: 250,
        flex: 1,
        color: '#fff',
        marginTop: -16,
        left: 8,
    },
    contentContainer: {
        padding: 16,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopStartRadius: 28
    },
    categoryColContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginHorizontal: -4,
    },
    categoryTiles: {
        paddingVertical: 16,
        margin: 4,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        alignSelf: 'center',
    },
    categoryTilesTitle: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 13,
    },
    categorySectionTitle: {
        marginTop: 8,
    },
    categorySectionSubtitle: {
        marginTop: -4,
    },
})