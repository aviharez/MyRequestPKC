import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    Image,
    Dimensions,
    FlatList,
    TouchableNativeFeedback
} from "react-native";

import {Txt} from '../component/Text';

import Icon from 'react-native-vector-icons/Feather';

import {style} from '../../assets/styles/Style';

const { width } = Dimensions.get("window");

const OutcomingData = [];

const IncomingData = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Syifa Nurzain',
      unit_name: 'Sekretaris Perusahaan',
      description: 'Perbaikan Iman Dan Takwa',
      status: 'finished',
      date: '2019-10-10',
      executor: 'Departemen Pengembangan'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f66',
      name: 'Kevin Christianto',
      unit_name: 'Departemen Teknologi Informasi',
      description: 'Perbaikan gizi',
      status: 'on progress',
      date: '2019-10-10',
      executor: 'Departemen Keuangan'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Syifa Nurzain',
      unit_name: 'Departemen Humas',
      description: 'Perbaikan jaringan sosial masyarakat dalam kehidupan bermasyarakat di lingkungan sekitar',
      status: 'waiting approval',
      date: '2019-10-10',
      executor: 'Departemen PPSDM'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Kevin Christianto',
      unit_name: 'Departemen Pengadaan',
      description: 'Perbaikan naon deui sok',
      status: 'waiting',
      date: '2019-10-10',
      executor: 'Departemen Teknologi Informasi'
    },
];

export default class MyRequest extends React.Component {

    _isMounted = false;

    state = {
        active: 0,
        xTabOne: 0,
        xTabTwo: 0,
        translateX: new Animated.Value(0),
        translateXTabOne: new Animated.Value(0),
        translateXTabTwo: new Animated.Value(width),
        translateY: -1000
    };

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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const IncomingRequest = ({id, name, deskripsi, status, date, executor}) => {

            const statusBadgeBg = () => {
                if (status == 'waiting approval') {
                    return style.bgAccent2;
                } else if (status == 'waiting') {
                    return style.bgAccent1;
                } else if (status == 'on progress') {
                    return style.bgPrimary;
                } else if (status == 'finished') {
                    return style.bgAccent3;
                } else {
                    return style.bgAccent4;
                }
            }

            const dateFormat = (date) => {
                const months = ["Jan", "Feb", "Mar","Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
                let requestDate = date.substr(0, 10)
                requestDate = requestDate.split('-')
                let newDate = new Date(
                    parseInt(requestDate[0]),
                    parseInt(requestDate[1]) - 1,
                    parseInt(requestDate[2])
                );
                let formattedDate = months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear()

                return formattedDate;
            }

            return (
                <View style={{ 
                    width: '100%', 
                    flexDirection: 'column', 
                    backgroundColor: 'transparent',
                    marginBottom: 12
                    }}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailRequest', {orderId: {id}})}>
                        <View style={{ flexDirection: 'column', backgroundColor: '#fff', padding: 16 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
                                <View style={{ flexDirection: 'column', marginLeft: 8, alignContent: 'center', alignSelf: 'center' }}>
                                    <Txt style={{ color: '#000', fontSize: 16 }}>{name}</Txt>
                                    <Txt style={{ color: '#cccbc7', fontSize: 13 }}>{date}</Txt>
                                </View>
                                <View style={[statusBadgeBg(), {
                                    borderRadius: 16,
                                    paddingStart: 4,
                                    paddingEnd: 4,
                                    paddingBottom: 4,
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    height: 18,
                                    marginLeft: 8,
                                    marginTop: 4
                                }]}>
                                    <Txt style={{ color: '#fff' }}>{status}</Txt>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', marginStart: 48, marginTop: 8 }}>
                                <Txt style={{ fontSize: 15 }}>{deskripsi}</Txt>
                                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                    <Icon name={'target'} style={{ height: 14, width: 14, color: '#cccbc7', marginTop: 2 }} />
                                    <Txt style={{ fontSize: 12, color: '#cccbc7', marginLeft: 4 }}>{executor}</Txt>
                                </View>
                            </View>
                        </View>
                        
                    </TouchableOpacity>

                </View>
            )

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
            <View style={{ flex: 1 }}>
                <View
                >   
                    <View style={{ flexDirection: 'column', width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto" }}>
                    <Txt style={{ 
                        fontSize: 24,
                        color: '#000',
                        top: 16,
                        fontWeight: 'bold',
                        marginBottom: 16,
                        marginTop: 8
                     }}>My Request</Txt>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 30,
                            marginBottom: 20,
                            height: 40,
                            position: "relative"
                        }}
                    >
                        <Animated.View
                            style={{
                                position: "absolute",
                                width: "50%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                backgroundColor: "#007aff",
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
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#007aff",
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
                                    color: active === 0 ? "#fff" : "#007aff"
                                }}
                            >
                                Keluar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#007aff",
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
                                    color: active === 1 ? "#fff" : "#007aff"
                                }}
                            >
                                Masuk
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    

                    {/* <ScrollView> */}
                        <Animated.View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    {
                                        translateX: translateXTabOne
                                    }
                                ]
                            }}
                            onLayout={event =>
                                this.setState({
                                    translateY: event.nativeEvent.layout.height
                                })
                            }
                        >
                            <FlatList
                                data={IncomingData}
                                renderItem={({item}) => <IncomingRequest id={item.id} name={item.name} deskripsi={item.description} status={item.status} date={item.date} executor={item.executor} /> }
                                keyExtractor={item => item.id}
                                contentContainerStyle={{paddingVertical: 16}} />
                        </Animated.View>

                        <Animated.View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    {
                                        translateX: translateXTabTwo
                                    },
                                    {
                                        translateY: -translateY
                                    }
                                ]
                            }}
                        >
                            <FlatList
                                data={IncomingData}
                                renderItem={({item}) => 
                                    <IncomingRequest name={item.name} deskripsi={item.description} status={item.status} date={item.date} executor={item.executor} /> }
                                keyExtractor={item => item.id}
                                contentContainerStyle={{paddingVertical: 16}} />
                        </Animated.View>
                    {/* </ScrollView> */}
                </View>
            </View>
        );
    }
}