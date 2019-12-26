import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image
} from 'react-native';

import {style} from '../../../assets/styles/Style';

import {Txt} from '../../component/Text';
import Icon from 'react-native-vector-icons/Feather';
import { FlatList } from 'react-native-gesture-handler';

const { width } = Dimensions.get("window")

const DATA = [
    {
        id: '1',
        name: 'Tes',
        deskripsi: 'Ini adalah contoh sebuah deskripsi',
        prioritas: 'E',
        date: '2019-12-12',
        unitName: 'Departemen Teknologi Informasi'
    },
    {
        id: '2',
        name: 'Tes',
        deskripsi: 'Ini adalah contoh sebuah deskripsi',
        prioritas: 'E',
        date: '2019-12-12',
        unitName: 'Departemen Teknologi Informasi'
    }
]

export default class Approval extends Component {
    render() {


        const RequestList = ({id, name, deskripsi, prioritas, date, unitName, status}) => {

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
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailRequest', {orderId: {id}})}>
                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', padding: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
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
                                marginTop: 4
                            }]}>
                                <Txt style={{ color: '#fff' }}>{prioritas}</Txt>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', marginStart: 48 }}>
                            <Txt numberOfLines={2} style={{ fontSize: 15 }}>{deskripsi}</Txt>
                            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                <Icon name={'target'} style={{ height: 14, width: 14, color: '#cccbc7'}} />
                                <Txt style={{ fontSize: 12, color: '#cccbc7', marginLeft: 2 }}>{unitName}</Txt>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )

        }


        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 8, padding: 16 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name={'chevron-left'} style={{ fontSize: 24, alignSelf: 'center' }} />
                            </TouchableOpacity>
                            <Txt style={{ 
                                fontSize: 24,
                                color: '#000',
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>Approve Request</Txt>
                        </View>

                        <FlatList
                                data={DATA}
                                renderItem={
                                    ({item}) => <RequestList name={item.name} deskripsi={item.deskripsi} prioritas={item.prioritas} date={item.date} unitName={item.unitName} id={item.id} />
                                }
                                keyExtractor={item => item.id}
                                contentContainerStyle={{paddingHorizontal: 8, width: width}} />

                    </View>
                </ScrollView>
                
            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        padding: 16,
    }
})