import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import Card from '../../component/Card'
import {style} from '../../../assets/styles/Style'
import {Txt, TxtBold} from '../../component/Text'
import {host} from '../../config/ApiHost'
import AsyncStorage from '@react-native-community/async-storage';

export default class DetailRequest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            keterangan: null,
            data: {},
            isLoading: true,
            isProcessing: false,
        }

        this.getDetail()
    }

    getDetail = async () => {
        let idOrderPok = this.props.navigation.getParam('orderId', 1)
        try {
            this.setState({isLoading: true})
            let response = await fetch(host + 'api/getDetailOrderPok/' + idOrderPok)
            response = await response.json()
            this.setState({data: response})
        } catch (err) {
            alert('Gagal mendapatkan data dari server')
            console.log(err)
        }

        this.setState({isLoading: false})
    }

    updateStatus = async (statusData) => {
        let nikSap = await AsyncStorage.getItem('nikSap')
        let idOrderPok = this.props.navigation.getParam('orderId')
        let updateData = null
        if (statusData == 'approve') {
            updateData = {
                status: 2,
                approvedBy: nikSap
            }
        } else if (statusData == 'accept') {
            updateData = {
                status: 3,
                acceptedBy: nikSap
            }
        } else if (statusData == 'finish') {
            updateData = {
                status: 4,
                keterangan: this.state.keterangan
            }
        }

        try {
            this.setState({isLoading: true})
            let response = await fetch(host + 'api/updateRequestStatus/' + idOrderPok, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData)
            })
            response = await response.json()
            if (response.status == 'success') {
                
                // If approve request, then send notification to all pic devices
                if (statusData == 'approve') {
                    let tokens = []
                    for (var key in response.deviceToken) {
                        if (response.deviceToken.hasOwnProperty(key)) {
                            tokens.push(response.deviceToken[key])
                        }
                    }
                    const message = {
                        "registration_ids": tokens,
                        "notification": {
                            "body": "Ada request baru menunggu untuk anda eksekusi",
                            "title": "Request Baru Diterima"
                        }
                    }
                    let headers = new Headers({
                        "Authorization": "key=AAAA9tGDLy4:APA91bHRrcgqxRYkJ9N8vRWqmT3vvnuNm2LddVqr7N9b5CdEfWCzAgsaFyYKEsCoVR1pNEExJcll_pKX9QibBGJPmGmJwJL6gA2nwkSXbQVqvwvvXNrk6iclGx-RFTkFORsMpam70iUL",
                        "Content-Type": "application/json"
                    })
                    let fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
                        method: "POST",
                        headers,
                        body: JSON.stringify(message)
                    })
                    fcmResponse = fcmResponse.json()
                    console.log(fcmResponse)
                }

                await alert('Request berhasil diupdate')
            } else {
                await alert('Request gagal diupdate')
            }

            this.props.navigation.goBack()
        } catch (err) {
            await alert('Request gagal diupdate')
            console.log(err)

            this.props.navigation.goBack()
        }
    }

    render() {

        const LoadingIndicator = () => {
            if (this.state.isLoading) {
                return (<ActivityIndicator size="large" />)
            } else {
                return null
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
            );
            let formattedDate = months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear()

            return formattedDate;
        }

        const prioritas = (prioritas) => {
            if (prioritas == 'E') {
                return 'E (Urgent, harus segera dikerjakan)'
            } else if (prioritas == '1') {
                return '1 (Maksimal 3 hari setelah disetujui)'
            } else if (prioritas == '2') {
                return '2 (Maksimal 7 hari setelah disetujui)'
            } else {
                return '3 (Maksimal 1 bulan setelah disetujui)'
            }
        }

        const ButtonAction = (props) => {
            if (this.props.navigation.getParam('viewOnly')) {
                return null
            } else {
                return (
                    <TouchableOpacity
                        disabled={this.state.isLoading ? true : (this.state.isProcessing ? true : false)}
                        onPress={
                            () => {
                                if (this.state.data.status == 4) {
                                    return
                                }
                                Alert.alert(
                                    'Konfirmasi',
                                    'Anda yakin ingin memproses order ini?',
                                    [
                                        {text: 'Batal'},
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                if (this.state.data.status == 3) {
                                                    this.updateStatus('finish')
                                                } else if (this.state.data.status == 2) {
                                                    this.updateStatus('accept')
                                                } else if (this.state.data.status == 1) {
                                                    this.updateStatus('approve')
                                                } else {
                                                    null
                                                }
                                            }
                                        }
                                    ],
                                    {cancelable: false}
                                )
                            }
                        }
                        style={{marginRight: 12, marginTop: -38, alignSelf: 'flex-end'}}
                    >
                        {props.children}
                    </TouchableOpacity>
                )
            }
        }

        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <TouchableOpacity style={{flex: 2}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name={'chevron-left'} style={s.headerBackIcon} />
                            </TouchableOpacity>
                            <View style={{ flex: 1, position: 'absolute', bottom: 36, left: 24 }}>
                                <TxtBold style={s.headerText} numberOfLines={3}>{this.state.data.kode_mesin ? this.state.data.kode_mesin : '-'}</TxtBold>
                                <Txt style={{fontSize: 18, color: '#fff'}}>{this.state.data.namaSubKategori}</Txt>
                            </View>
                            
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{flexDirection: 'column'}}>
                                <ButtonAction>
                                    <View style={{ 
                                        backgroundColor: '#ffaa0d', 
                                        width: 120, 
                                        height: 45, 
                                        borderRadius: 24,
                                    }}>
                                        <Txt style={{ 
                                            color: '#fff', 
                                            fontSize: 18, 
                                            alignContent: 'center', 
                                            alignSelf: 'center',
                                            marginTop: 12
                                        }}>
                                            {this.state.data.status == 3 ? 'Finish' : (this.state.data.status == 2 ? 'Accept' : (this.state.data.status == 1 ? 'Approve' : (this.state.data.status == 4 ? 'Finished' : null)))}
                                        </Txt>
                                    </View>
                                </ButtonAction>
                                <LoadingIndicator />
                                <View style={{ padding: 16 }}>
                                    <Txt style={{ fontSize: 16, marginTop: 16 }}>{this.state.data.deskripsi}</Txt>
                                    <View style={{ marginTop: 24, marginBottom: 16, backgroundColor: '#cccbc7', width: '100%', height: 1 }}></View>
                                    <View style={{ flexDirection: 'row', marginLeft: -4, marginBottom: 16 }}>
                                        <Image source={require('../../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
                                        <View style={{ flexDirection: 'column', marginLeft: 8, alignContent: 'center', alignSelf: 'center' }}>
                                            <Txt style={{ color: '#000', fontSize: 16 }}>{this.state.data.namaPemohon}</Txt>
                                            <Txt style={{ color: '#cccbc7', fontSize: 13 }}>{this.state.data.unitName}</Txt>
                                        </View>
                                    </View>
                                    <TxtBold style={{ fontSize: 16 }}>Ketentuan</TxtBold>
                                    <Txt style={{ fontSize: 14 }}>- Penghentian Operasi Pabrik: <TxtBold>{this.state.data.penghentianPabrik == 1 ? 'Ya' : 'Tidak'}</TxtBold></Txt>
                                    <Txt style={{ fontSize: 14 }}>- Izin pekerjaan panas disyaratkan: <TxtBold>{this.state.data.syarat == 'panas' || this.state.data.syarat == 'both' ? 'Ya' : 'Tidak'}</TxtBold></Txt>
                                    <Txt style={{ fontSize: 14 }}>- Izin pekerjaan dingin disyaratkan: <TxtBold>{this.state.data.syarat == 'dingin' || this.state.data.syarat == 'both' ? 'Ya' : 'Tidak'}</TxtBold></Txt>
                                    
                                    <View style={{ marginTop: 24, marginBottom: 16, backgroundColor: '#cccbc7', width: '100%', height: 1 }}></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name={'calendar'} style={{ fontSize: 16, alignSelf: 'center', color: '#5794ff' }} />
                                        <Txt style={{ fontSize: 16, marginLeft: 8 }}>{dateFormat(this.state.data.tanggal)}</Txt>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                        <Icon name={'clock'} style={{ fontSize: 16, alignSelf: 'center', color: '#5794ff' }} />
                                        <Txt style={{ fontSize: 16, marginLeft: 8 }}>{prioritas(this.state.data.prioritas)}</Txt>
                                    </View>
                                    <TxtBold style={{ fontSize: 16, marginTop: 24 }}>Status Request</TxtBold>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diapprove Oleh</Txt>
                                            <Txt style={{ fontSize: 14 }}>{this.state.data.namaApprover ? this.state.data.namaApprover : '-'}</Txt>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Tanggal Approve</Txt>
                                            <Txt style={{ fontSize: 14 }}>{dateFormat(this.state.data.approvedDate)}</Txt>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diterima Oleh</Txt>
                                            <Txt style={{ fontSize: 14 }}>{this.state.data.namaPenerima ? this.state.data.namaPenerima : '-'}</Txt>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Tanggal Diterima</Txt>
                                            <Txt style={{ fontSize: 14 }}>{dateFormat(this.state.data.acceptedDate)}</Txt>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diselesaikan Pada</Txt>
                                            <Txt style={{ fontSize: 14 }}>{dateFormat(this.state.data.finishedDate)}</Txt>
                                        </View>
                                    </View>
                                    <TxtBold style={{ fontSize: 16, marginTop: 24 }}>Keterangan</TxtBold>
                                    <View style={{
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#cccbc7',
                                        width: '100%',
                                        height: 100,
                                        marginVertical: 8
                                    }}>
                                        <TextInput 
                                            multiline={true}
                                            editable={this.state.data.status == '3' ? true : false}
                                            numberOfLines={4}
                                            onChangeText={(keterangan) => this.setState({keterangan})}
                                            value={this.state.data.keterangan}
                                            style={{marginHorizontal: 8, textAlignVertical: 'top'}} />
                                    </View>
                                </View>
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
        height: 300,
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
        width: 300,
        color: '#fff',
    },
    contentContainer: {
        padding: 16,
        marginTop: -24,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        borderTopEndRadius: 28
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