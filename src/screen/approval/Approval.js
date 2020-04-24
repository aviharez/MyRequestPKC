import React from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
    FlatList,
} from 'react-native'
import {Txt} from '../../component/Text'
import {Icon} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

import {style} from '../../../assets/styles/Style'

import {host} from '../../config/ApiHost'

const { width } = Dimensions.get("window")

export default class Approval extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            refreshing: false,
            data: null,
        }
    }

    componentDidMount() {
        this.focusListener = [
            this.props.navigation.addListener('didFocus', () => {
                this.getUnapproved()
            }),
            this.props.navigation.addListener('willBlur', () => {
                this.setState({data: null})
            })
        ]
    }

    componentWillUnmount() {
        this.focusListener.forEach(listener => listener.remove())
    }

    getUnapproved = async () => {
        let unitId = await AsyncStorage.getItem('unitId')
        try {
            this.setState({refreshing: true})
            let response = await fetch(host + 'api/getUnapprovedOrderPok/' + unitId)
            response = await response.json()
            this.setState({data: response})
            console.log(response)
        } catch (err) {
            alert('Gagal mendapatkan data dari server')
            console.log(err)
        }

        this.setState({refreshing: false})
    }

    render() {

        const RequestList = ({id, name, deskripsi, prioritas, date, unitName, status}) => {

            const prioritasBadgeBg = () => {
                if (prioritas == 'E') {
                    return style.bgAccent4
                } else if (prioritas == '1') {
                    return style.bgAccent2
                } else if (prioritas == '2') {
                    return style.bgPrimary
                } else if (prioritas == '3') {
                    return style.bgAccent1
                }
            }

            const dateFormat = (date = null) => {
                if (date == null) {
                    return '-'
                }

                const months = ["Jan", "Feb", "Mar","Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
                let requestDate = date.substr(0, 10)
                requestDate = requestDate.split('-')
                let newDate = new Date(
                    parseInt(requestDate[0]),
                    parseInt(requestDate[1]) - 1,
                    parseInt(requestDate[2])
                )
                let formattedDate = months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear()

                return formattedDate
            }

            return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailRequest', {orderId: parseInt(id)})}>
                    <View style={{ flexDirection: 'column', backgroundColor: '#fff', padding: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
                            <View style={{ flexDirection: 'column', marginLeft: 8,}}>
                                <Txt style={{ color: '#000', fontSize: 16, maxWidth: 180}} numberOfLines={1}>{name}</Txt>
                                <Txt style={{ color: '#cccbc7', fontSize: 13}}>{dateFormat(date)}</Txt>
                            </View>
                            <View style={[prioritasBadgeBg(), {
                                borderRadius: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 20,
                                width: 20,
                                marginLeft: 8,
                                marginTop: -14
                            }]}>
                                <Txt style={{ color: '#fff' }}>{prioritas}</Txt>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', marginStart: 48 }}>
                            <Txt numberOfLines={2} style={{ fontSize: 15 }}>{deskripsi}</Txt>
                            <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                                <Icon name={'target'} type='feather' size={14} color='#cccbc7' />
                                <Txt style={{ fontSize: 12, color: '#cccbc7', marginLeft: 2 }}>{unitName}</Txt>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )

        }


        return (
            <View style={[style.mainContainer]}>
                <View style={{ flexDirection: 'row', marginVertical: 8, padding: 16, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name={'chevron-left'} style={{ fontSize: 18}} />
                    </TouchableOpacity>
                    <Txt style={{ 
                        fontSize: 18,
                        color: '#333',
                        fontWeight: 'bold',
                        alignSelf: 'center'
                    }}>Approve Request</Txt>
                </View>

                <FlatList
                    data={this.state.data}
                    renderItem={
                        ({item}) => <RequestList name={item.namaPegawai} deskripsi={item.deskripsi} prioritas={item.prioritas} date={item.tanggal} unitName={item.namaSubKategori} status={item.status} id={item.idOrderPok} />
                    }
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.getUnapproved()}
                    keyExtractor={item => item.idOrderPok}
                    contentContainerStyle={{paddingHorizontal: 16, width: width}} />

            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        padding: 16,
    }
})