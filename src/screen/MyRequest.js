import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    TouchableNativeFeedback,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import {Icon} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

import {Txt} from '../component/Text'
import {style} from '../../assets/styles/Style'
import {host} from '../../src/config/ApiHost'

const { width } = Dimensions.get('window')

export default class MyRequest extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props)

        this.state = {
            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateY: -1000,
            incomingRequest: null,
            outcomingRequest: null,
            refreshing: false,
            isSearching: null,
        }
    }

    getRequest = async () => {
        let nikSap = await AsyncStorage.getItem('nikSap')
        try {
            this.setState({refreshing: true})
            let response
            if (this.state.isSearching) {
                response = await fetch(encodeURI(host + 'api/getOrderOutPok/' + nikSap + '?q=' + this.props.navigation.getParam('q')))
            } else {
                response = await fetch(encodeURI(host + 'api/getOrderOutPok/' + nikSap))
            }
            response = await response.json()
            this.setState({outcomingRequest: response})
            if (this.state.isSearching) {
                response = await fetch(encodeURI(host + 'api/getOrderInPok/' + nikSap + '?q=' + this.props.navigation.getParam('q')))
            } else {
                response = await fetch(encodeURI(host + 'api/getOrderInPok/' + nikSap))
            }
            response = await response.json()
            this.setState({incomingRequest: response})
        } catch (err) {
            alert('Gagal mengambil data dari server')
            console.log(err)
        }

        this.setState({refreshing: false})
    }

    handleSlide = type => {
        let {
            active,
            xTabOne,
            xTabTwo,
            translateX,
            translateXTabOne,
            translateXTabTwo
        } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            duration: 100
        }).start();
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100
                }).start()
            ]);
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100
                }).start()
            ]);
        }
    };

    componentDidMount() {
        this._isMounted = true;
        this.focusListener = [
            this.props.navigation.addListener('didFocus', () => {
                if (this.props.navigation.getParam('q') !== undefined && this.props.navigation.getParam('q') !== null) {
                    this.setState({isSearching: true})
                } else {
                    this.setState({isSearching: false})
                }
                this.getRequest()
                console.log(this.props.navigation.getParam('q'))
                console.log(this.state.isSearching)
            }),
            this.props.navigation.addListener('willBlur', () => {
                this.setState({incomingRequest: null, outcomingRequest: null});
            })
        ];
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.focusListener.forEach(listener => listener.remove());
    }

    render() {

        const RequestList = ({id, name, deskripsi, prioritas, date, unitName, status, viewOnly}) => {

            const prioritasBadgeBg = () => {
                if (prioritas == 'E') {
                    return style.bgAccent4;
                } else if (prioritas == '1') {
                    return style.bgAccent2;
                } else if (prioritas == '2') {
                    return style.bgPrimary;
                } else if (prioritas == '3') {
                    return style.bgAccent1;
                }
            }

            const statusName = () => {
                if (status == '1') {
                    return 'Waiting Approval'
                } else if (status == '2') {
                    return 'Waiting'
                } else if (status == '3') {
                    return 'On Process'
                } else if (status == '4') {
                    return 'Finished'
                } else {
                    return 'Rejected'
                }
            }

            const dateFormat = (date) => {
                const months = ['Jan', 'Feb', 'Mar','Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
                let requestDate = date.substr(0, 10)
                requestDate = requestDate.split('-')
                let newDate = new Date(
                    parseInt(requestDate[0]),
                    parseInt(requestDate[1]) - 1,
                    parseInt(requestDate[2])
                );
                let formattedDate = months[newDate.getMonth()] + ' ' + newDate.getDate() + ', ' + newDate.getFullYear()

                return formattedDate;
            }

            return (
                <TouchableOpacity onPress={() => {
                    if (viewOnly) {
                        this.props.navigation.navigate('DetailRequest', {orderId: parseInt(id), viewOnly: true})
                    } else {
                        this.props.navigation.navigate('DetailRequest', {orderId: parseInt(id)})
                    }
                }}>
                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', padding: 8, flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
                            <View style={{ flexDirection: 'column', marginLeft: 8,}}>
                                <Txt style={{ color: '#000', fontSize: 16, maxWidth: 140}} numberOfLines={1}>{name}</Txt>
                                <Txt style={{ color: '#cccbc7', fontSize: 13}}>{dateFormat(date)}</Txt>
                            </View>
                            <View style={[prioritasBadgeBg(), {
                                borderRadius: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 20,
                                width: 20,
                                marginLeft: 8,
                                marginTop: -2
                            }]}>
                                <Txt style={{ color: '#fff' }}>{prioritas}</Txt>
                            </View>
                            <View style={[style.bgPrimary, {
                                borderRadius: 16,
                                paddingHorizontal: 8,
                                justifyContent: 'center',
                                height: 18,
                                marginLeft: 4,
                                marginTop: -1
                            }]}>
                                <Txt style={{ color: '#fff' }}>{statusName()}</Txt>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', marginStart: 48 }}>
                            <Txt numberOfLines={2} style={{ fontSize: 15 }}>{deskripsi}</Txt>
                            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                <Icon name='target' type='feather' size={14} color='#cccbc7' containerStyle={{top: -1}} />
                                <Txt style={{ fontSize: 12, color: '#cccbc7', marginLeft: 2 }}>{unitName}</Txt>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )

        }

        const SearchBadge = () => {
            if (this.state.isSearching) {
                const removeParam = () => {
                    this.props.navigation.setParams({q: null})
                    this.setState({isSearching: false})
                    this.getRequest()
                }
                return (
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <View style={s.searchBadge}>
                            <Text style={{color: '#666'}}>{this.props.navigation.getParam('q')}</Text>
                            <TouchableOpacity onPress={() => removeParam()}>
                                <Icon
                                    name='x'
                                    type='feather'
                                    reverse
                                    color='#fafafa'
                                    reverseColor='#666'
                                    size={8}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            } else {
                return null
            }
        }

        let {
            xTabOne,
            xTabTwo,
            translateX,
            active,
            translateXTabOne,
            translateXTabTwo,
            translateY
        } = this.state;

        return (
            <View style={{flex: 1}}>
                <View style={{
                    width: '90%',
                    // height: 280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    flexDirection: 'column',
                }}>
                    <Txt style={{ 
                        fontSize: 24,
                        color: '#000',
                        top: 16,
                        fontWeight: 'bold',
                        marginVertical: 8,
                    }}>My Request</Txt>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 30,
                            height: 40,
                            position: 'relative'
                        }}
                    >
                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: '50%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                backgroundColor: '#007aff',
                                borderRadius: 4,
                                transform: [
                                    {
                                        translateX
                                    }
                                ]
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#007aff',
                                borderRadius: 4,
                                borderRightWidth: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabOne: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 0 }, () =>
                                    this.handleSlide(xTabOne)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 0 ? '#fff' : '#007aff'
                                }}
                            >
                                Keluar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#007aff',
                                borderRadius: 4,
                                borderLeftWidth: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabTwo: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 1 }, () =>
                                    this.handleSlide(xTabTwo)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 1 ? '#fff' : '#007aff'
                                }}
                            >
                                Masuk
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SearchBadge/>
                </View>
                
                <View style={{flex: 1,}}>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: translateXTabOne
                                }
                            ],
                            width: width,
                            marginTop: 8,
                        }}
                        onLayout={event =>
                            this.setState({
                                translateY: event.nativeEvent.layout.height
                            })
                        }
                    >
                        <FlatList
                            data={this.state.outcomingRequest}
                            renderItem={
                                ({item}) => <RequestList name={item.namaPegawai} deskripsi={item.deskripsi} prioritas={item.prioritas} date={item.tanggal} unitName={item.namaSubKategori} status={item.status} id={item.idOrderPok} viewOnly={true} />
                            }
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({refreshing: true}, () => {
                                    this.getRequest()
                                })
                            }}
                            keyExtractor={item => item.idOrderPok}
                            contentContainerStyle={{}} />
                    </Animated.View>

                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateX: translateXTabTwo
                                },
                                {
                                    translateY: -translateY
                                }
                            ],
                            width: width,
                            marginTop: 8,
                        }}
                    >
                        <FlatList
                            data={this.state.incomingRequest}
                            renderItem={
                                ({item}) => <RequestList name={item.namaPegawai} deskripsi={item.deskripsi} prioritas={item.prioritas} date={item.tanggal} unitName={item.unitName} status={item.status} id={item.idOrderPok} viewOnly={false} />
                            }
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({refreshing: true}, () => {
                                    this.getRequest()
                                })
                            }}
                            keyExtractor={item => item.idOrderPok}
                            contentContainerStyle={{}} />
                    </Animated.View>
                </View>
                
            </View>
        );
    }
}

const s = StyleSheet.create({
    searchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingStart: 10,
        backgroundColor: 'rgba(0, 0, 0, .05)',
        borderRadius: 24,
    }
})