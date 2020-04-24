import React from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Picker,
    Platform,
    TouchableNativeFeedback,
    Alert,
    Button,
    ToastAndroid
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {Icon, Button as Btn} from 'react-native-elements'
import LoadingModal from '../../component/LoadingModal'
import DateTimePicker from '@react-native-community/datetimepicker'
import MultiSelect from 'react-native-multiple-select'

import {style} from '../../../assets/styles/Style'
import {Txt, TxtBold} from '../../component/Text'
import {host} from '../../config/ApiHost'
import Global from '../../config/Global'


class RequestBtn extends React.PureComponent {
	render() {
		const {isProcessing, ...restProps} = this.props
		const requestText = () => {
			if (isProcessing) {
				return (<ActivityIndicator size="large" color='white' style={{marginVertical: 4}} />)
			} else {
				return (<TxtBold style={s.requestBtnTxt}>Submit</TxtBold>)
			}
		}

		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...restProps}>
					<View style={s.requestBtn}>
						{requestText()}
					</View>
				</TouchableNativeFeedback>
			)
		}
	}
}

export default class FormPok extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            isProcessing: false,
            venueList: null,
            employeeList: [],
            selectedVenueName : null,
            selectedPenanggungJawab: [],
            venue: 0,
            deskripsi: null,
            jenisTamu: null,
            tglMulai: null,
            tglSelesai: null,
            waktuMulai: null,
            waktuSelesai: null,
            showDatePicker: false,
            showTimePicker: false,
            datepickerType: null,
            timepickerType: null,
            bebanBiaya: null,
        }

        this.hasMounted = false
    }

    componentDidMount() {
        this.hasMounted = true

        // this.hasMounted ? this.getRequiredData() : null
    }

    componentWillUnmount() {
        this.hasMounted = false
    }

    submitData = async () => {
        this.sendNotification(this.state.jenisTamu)
        // try {
        //     this.hasMounted ? this.setState({isProcessing: true}) : null
        //     const empId = await AsyncStorage.getItem('nikSap')
        //     let start_date = new Date(this.state.waktuMulai)
        //     start_date = `${start_date.getFullYear()}-${start_date.getMonth() + 1}-${start_date.getDate()}`
        //     let start_time = new Date(this.state.waktuMulai)
        //     start_time = `${('0' + start_time.getHours()).slice(-2)}:${('0' + start_time.getMinutes()).slice(-2)}`
        //     start_time = `${start_date} ${start_time}`
        //     let end_date = new Date(this.state.waktuMulai)
        //     end_date = `${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`
        //     let end_time = new Date(this.state.waktuMulai)
        //     end_time = `${('0' + end_time.getHours()).slice(-2)}:${('0' + end_time.getMinutes()).slice(-2)}`
        //     end_time = `${end_date} ${end_time}`

        //     let data = {
        //         'requester': empId,
        //         'venue': this.state.venue,
        //         'description': this.state.deskripsi,
        //         'guest': this.state.jenisTamu,
        //         'start_time': start_time,
        //         'end_time': end_time,
        //         'person_in_charge': this.state.selectedPenanggungJawab[0],
        //         'costs': this.state.bebanBiaya
        //     }
        //     let body = []
        //     for (let property in data) {
        //         let encodedKey = encodeURIComponent(property)
        //         let encodedValue = encodeURIComponent(data[property])

        //         body.push(encodedKey + '=' + encodedValue)
        //     }
        //     body = body.join('&')

        //     let response = await fetch(`${host}api/venue-submit`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         },
        //         body: body
        //     })
        //     response = await response.json()

        //     if (response.success) {
        //         ToastAndroid.show('Request venue berhasil, silakan tunggu approval dari atasan terkait.', ToastAndroid.SHORT)
        //         this.hasMounted ? this.setState({isProcessing: false}, this.sendNotification(this.state.jenisTamu)) : null
        //         this.props.navigation.navigate('Dashboard')
        //     } else {
        //         ToastAndroid.show('Request venue GAGAL', ToastAndroid.SHORT)
        //         this.hasMounted ? this.setState({isProcessing: false}) : null
        //     }
        // } catch (err) {
        //     ToastAndroid.show('Terjadi kesalahan.', ToastAndroid.SHORT)
        //     this.hasMounted ? this.setState({isProcessing: false}) : null
        // }
    }

    sendNotification = async guestType => {
        if (guestType == 'internal') {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken')
                const parentId = await AsyncStorage.getItem('parentId')

                let getManager = await fetch(`http://wbs.pupuk-kujang.co.id:8081/hrdmobile/employees/PARENT-${parentId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                getManager = await getManager.json()
                getManager = getManager.data
                
                let manager = getManager.filter(item => {
                    const itemData = item.kd_jabatan
                    const textData = 50002164
        
                    return itemData.indexOf(textData) > -1
                })
                manager = manager[0].no_badge
                let tokens = await this.getNotificationToken(manager)

                let fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `key=${Global.serverKey}`
                    },
                    body: JSON.stringify({
                        'registration_ids': tokens,
                        'data': {
                            'title': 'Test',
                            'message': 'Yeuh',
                            'body': 'Ini body'
                        }
                    })
                })
                fcmResponse = await fcmResponse.json()
                
                if (fcmResponse.failure > 0) {
                    ToastAndroid.show(`${fcmResponse.failure} notifikasi gagal dikirim`, ToastAndroid.SHORT)
                }
            } catch (e) {
                console.log('Send notification failed. ' + e)
                ToastAndroid.show('Gagal mengirimkan notifikasi', ToastAndroid.SHORT)
            }
        }
    }

    getNotificationToken = async noBadge => {
        if (noBadge > 1) {
            try {
                let tokenData = {
                    'badge': noBadge
                }
                let body = []
                for (let property in tokenData) {
                    let encodedKey = encodeURIComponent(property)
                    let encodedValue = encodeURIComponent(tokenData[property])

                    body.push(encodedKey + '=' + encodedValue)
                }
                body = body.join('&')

                let tokens = await fetch(`${host}api/token-list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body
                })
                tokens = await tokens.json()

                return tokens
            } catch (e) {
                return false
            }
        }
    }

    getRequiredData = async () => {
        try {
            this.hasMounted ? this.setState({isLoading: true}) : null
            const accessToken = await AsyncStorage.getItem('accessToken')
            let response = await fetch(`${host}api/venue-list`)
            response = await response.json()
            let employees = await fetch('http://wbs.pupuk-kujang.co.id:8081/hrdmobile/employees/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            employees = await employees.json()
            let data = []
            employees.data.map((val, i) => {
                data.push({value: val.no_badge, label: `(${val.no_badge}) ${val.nama}`})
            })

            if (response.success) {
                this.hasMounted ? this.setState({isLoading: false, venueList: response.response, employeeList: data}) : null
            } else {
                this.hasMounted ? this.setState({isLoading: false}) : null
                Alert.alert('Terjadi Kesalahan', 'Gagal menghubungkan ke server.')
                this.props.navigation.goBack()
            }
        } catch (err) {
            console.log(err)
            Alert.alert('Terjadi Kesalahan', 'Gagal menghubungkan ke server.')
            this.hasMounted ? this.setState({isLoading: false}) : null
            this.props.navigation.goBack()
        }
    }

    handleOnChange = (event, selectedDate, type) => {
        let stateValue = {}
        if (type == 'tglMulai') {
            const currentDate = selectedDate || this.state.tglMulai
            stateValue = {showDatePicker: false, tglMulai: currentDate}
        } else {
            const currentDate = selectedDate || this.state.tglSelesai
            stateValue = {showDatePicker: false, tglSelesai: currentDate}
        }

        this.hasMounted ? this.setState(stateValue) : null
    }

    handleOnChangeTime = (event, selectedDate, type) => {
        let stateValue = {}
        if (type == 'waktuMulai') {
            const currentDate = selectedDate || this.state.tglMulai
            stateValue = {showTimePicker: false, waktuMulai: currentDate}
        } else {
            const currentDate = selectedDate || this.state.tglSelesai
            stateValue = {showTimePicker: false, waktuSelesai: currentDate}
        }

        this.hasMounted ? this.setState(stateValue) : null
    }

    formatDate = (unformatted, returnType) => {
        let date = new Date(unformatted)
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        if (returnType == 'date') {
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        } else {
            return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
        }
    }

    render() {
        const { navigation } = this.props
        return (
            <View style={[style.mainContainer]}>
                <LoadingModal show={this.state.isLoading} />
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <TouchableOpacity style={{flex: 2}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name='chevron-left' type='feather' color='#fff' size={24} />
                            </TouchableOpacity>
                            <Txt style={s.headerText}>Form Request Venue</Txt>
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{marginTop: 8, flexDirection: 'column'}}>
                                <Txt>Lokasi Venue</Txt>
                                <Picker
                                    selectedValue={this.state.selectedVenueName}
                                    // itemStyle={s.textInput}
                                    style={s.textInput}
                                    onValueChange={(itemValue, itemIndex) =>{
                                        this.hasMounted ? (itemIndex > 0 ? this.setState({venue: itemIndex, selectedVenueName: itemValue}) : null) : null
                                    }}
                                >
                                    <Picker.Item label="Pilih Venue" value="" />
                                    {this.state.venueList ? this.state.venueList.map((val, i) => (
                                        <Picker.Item label={val.venue_name} value={i} key={i} />
                                    )) : null}
                                </Picker>
                                <Txt style={{ marginTop: 16 }}>Tujuan Peminjaman</Txt>
                                <TextInput
							        style={s.textArea}
							        placeholder="Uraian tujuan peminjaman"
                                    multiline={true}
                                    numberOfLines={5}
                                    textAlignVertical={'top'}
							        onChangeText={(deskripsi) => this.setState({deskripsi})}
							        value={this.state.deskripsi}
							        placeholderTextColor="#d3d4cf" />
                                <Txt style={{ marginTop: 16 }}>Jenis Tamu</Txt>
                                <Picker
                                    selectedValue={this.state.jenisTamu}
                                    // itemStyle={s.textInput}
                                    style={s.textInput}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.hasMounted ? (itemIndex > 0 ? this.setState({jenisTamu: itemValue}) : null) : null
                                    }>
                                    <Picker.Item label="Pilih Jenis Tamu" value="" />
                                    <Picker.Item label="Eksternal" value="eksternal" />
                                    <Picker.Item label="Internal" value="internal" />
                                </Picker>

                                {this.state.showDatePicker &&
                                    <DateTimePicker
                                        value={this.state.tglMulai || this.state.tglSelesai ? this.state.tglMulai || this.state.tglSelesai : new Date()}
                                        onChange={(event, selectedDate) => this.handleOnChange(event, selectedDate, this.state.datepickerType)}
                                        minimumDate={new Date()}
                                />}
                                {this.state.showTimePicker &&
                                    <DateTimePicker
                                        value={this.state.waktuMulai || this.state.waktuSelesai ? this.state.waktuMulai || this.state.waktuSelesai : new Date()}
                                        onChange={(event, selectedDate) => this.handleOnChangeTime(event, selectedDate, this.state.timepickerType)}
                                        mode='time'
                                />}

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: '50%'}}>
                                        <Txt style={{ marginTop: 16 }}>Tanggal Mulai</Txt>
                                        <Btn
                                            title={this.state.tglMulai ? this.formatDate(this.state.tglMulai, 'date') : 'Pilih Tanggal Mulai'}
                                            type='clear'
                                            titleStyle={{fontFamily: 'Product Sans', color: 'rgba(51, 51, 51, .8)', width: '100%', textAlign: 'left'}}
                                            onPress={() => this.hasMounted ? this.setState({showDatePicker: true, datepickerType: 'tglMulai'}) : null}
                                        />
                                    </View>
                                    <View style={{width: '50%'}}>
                                        <Txt style={{ marginTop: 16 }}>Waktu Mulai</Txt>
                                        <Btn
                                            title={this.state.waktuMulai ? this.formatDate(this.state.waktuMulai, 'time') : 'Pilih Waktu Mulai'}
                                            type='clear'
                                            titleStyle={{fontFamily: 'Product Sans', color: 'rgba(51, 51, 51, .8)', width: '100%', textAlign: 'left'}}
                                            onPress={() => this.hasMounted ? this.setState({showTimePicker: true, timepickerType: 'waktuMulai'}) : null}
                                        />
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: '50%'}}>
                                        <Txt style={{ marginTop: 16 }}>Tanggal Selesai</Txt>
                                        <Btn
                                            title={this.state.tglSelesai ? this.formatDate(this.state.tglSelesai, 'date') : 'Pilih Tanggal Selesai'}
                                            type='clear'
                                            titleStyle={{fontFamily: 'Product Sans', color: 'rgba(51, 51, 51, .8)', width: '100%', textAlign: 'left'}}
                                            onPress={() => this.hasMounted ? this.setState({showDatePicker: true, datepickerType: 'tglSelesai'}) : null}
                                        />
                                    </View>
                                    <View style={{width: '50%'}}>
                                        <Txt style={{ marginTop: 16 }}>Waktu Selesai</Txt>
                                        <Btn
                                            title={this.state.waktuSelesai ? this.formatDate(this.state.waktuSelesai, 'time') : 'Pilih Waktu Selesai'}
                                            type='clear'
                                            titleStyle={{fontFamily: 'Product Sans', color: 'rgba(51, 51, 51, .8)', width: '100%', textAlign: 'left'}}
                                            onPress={() => this.hasMounted ? this.setState({showTimePicker: true, timepickerType: 'waktuSelesai'}) : null}
                                        />
                                    </View>
                                </View>

                                <Txt style={{marginTop: 16}}>Penanggung Jawab</Txt>
                                <MultiSelect
                                    items={this.state.employeeList}
                                    uniqueKey='value'
                                    displayKey='label'
                                    onSelectedItemsChange={selectedItems => this.hasMounted ? this.setState({selectedPenanggungJawab: selectedItems}) : null}
                                    selectedItems={this.state.selectedPenanggungJawab}
                                    selectText='Pilih Penanggung Jawab'
                                    styleTextDropdownSelected={{paddingStart: 8}}
                                    searchInputPlaceholderText='Cari Pegawai'
                                    flatListProps={{nestedScrollEnabled: true}}
                                    styleMainWrapper={{marginTop: 6}}
                                    single
                                    fixedHeight
                                />
                                <Txt style={{marginTop: 16}}>Beban Biaya</Txt>
                                <TextInput
							        style={s.textInput}
							        placeholder="Beban Biaya"
							        onChangeText={bebanBiaya => this.setState({bebanBiaya})}
							        value={this.state.bebanBiaya}
							        placeholderTextColor="#d3d4cf" />

                                <RequestBtn onPress={this.submitData} isProcessing={this.state.isProcessing} />
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
        backgroundColor: '#5794ff',
        alignItems: 'flex-start'
        // borderWidth: 1,
        // borderColor: 'red',
    },
    headerText: {
        fontSize: 24,
        width: 250,
        flex: 1,
        color: '#fff',
        position: 'absolute',
        bottom: 30,
        left: 24,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 24,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        flexDirection: 'column'
    },
    textInput: {
		fontSize: 16,
        height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        borderColor: 'rgba(87, 148, 255, .4)',
        borderWidth: 1,
		paddingStart: 8,
		paddingEnd: 16,
        color: 'rgba(51, 51, 51, 0.8)',
        top: 4,
        fontFamily: 'Product Sans',
    },
    textArea: {
		fontSize: 16,
        height: 100,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        borderColor: 'rgba(87, 148, 255, .4)',
        borderWidth: 1,
		paddingStart: 8,
		paddingEnd: 16,
        color: 'rgba(51, 51, 51, 0.8)',
        top: 4
    },
	requestBtn: {
		backgroundColor: '#5794ff',
		borderRadius: 16,
		alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24
	},
	requestBtnTxt: {
		fontSize: 18,
		letterSpacing: 1,
		paddingVertical: 12,
		color: '#fff',
	},
})