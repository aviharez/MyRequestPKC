import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Button,
    Dimensions,
    Picker,
    Platform,
    TouchableNativeFeedback,
    Alert
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import {NavigationActions, StackActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';

import {style} from '../../../assets/styles/Style';
import {Txt, TxtBold} from '../../component/Text';
import {host} from '../../config/ApiHost';

const {width: WIDTH} = Dimensions.get('window');


class RequestBtn extends Component {
	render() {
		const {isProcessing, ...restProps} = this.props;
		const requestText = () => {
			if (isProcessing) {
				return (<ActivityIndicator size="large" color='white' style={{marginVertical: 4}} />);
			} else {
				return (<TxtBold style={s.requestBtnTxt}>Submit</TxtBold>);
			}
		}

		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...restProps}>
					<View style={s.requestBtn}>
						{requestText()}
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

export default class FormPok extends Component {

    constructor(props) {
        super(props);

        this.getUnitId();
        console.log()

        this.state = {
            idSubKategori: this.props.navigation.getParam('subCategoryId'),
            kode_mesin: null,
            deskripsi: null,
            prioritas: null,
            penghentianPabrik: false,
            dingin: false,
            panas: false,
            pemohon: null,
            unitId: null,
            isProcessing: false,
        }
    }

    getUnitId = async () => {
        const unitId = await AsyncStorage.getItem('unitId')
        const nikSap = await AsyncStorage.getItem('nikSap')
        this.setState({unitId: unitId, pemohon: nikSap})
    }

    submitData = async () => {
        const {kode_mesin, deskripsi, prioritas, penghentianPabrik, dingin, panas, ...restState} = this.state;
        if (!kode_mesin || !deskripsi || !prioritas) {
            alert('Kode mesin, deskripsi, dan prioritas wajib diisi')
            return
        }

        try {
            this.setState({isProcessing: true})
            var syarat = null
            if (dingin && panas) {
                syarat = 'both'
            } else if (dingin && !panas) {
                syarat = 'dingin'
            } else if (panas && !dingin) {
                syarat = 'panas'
            }
            let response = await fetch(host + 'api/submitOrderPok', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idSubKategori: this.state.idSubKategori,
                    kode_mesin: this.state.kode_mesin,
                    deskripsi: this.state.deskripsi,
                    prioritas: this.state.prioritas,
                    penghentianPabrik: this.state.penghentianPabrik == true ? 1 : 0,
                    syarat: syarat,
                    unitId: this.state.unitId,
                    pemohon: this.state.pemohon
                })
            })

            response = await response.json()
            if (response.status == 'success') {
                this.setState({isProcessing: false})
                let picDeviceToken = response.picDeviceToken
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'Dashboard'})]
                })
                Alert.alert(
                    'YEAY!', 
                    'Request order berhasil disubmit,\nsilakan tunggu persetujuan dari kepala unit anda',
                    [{
                        text: 'OK',
                        onPress: () => {
                            this.props.navigation.dispatch(resetAction)
                            this.props.navigation.navigate('MyRequest')
                        }
                    }],
                    {cancelable: false}
                )
            } else {
                console.log(response)
                this.setState({isProcessing: false})
            }
        } catch (err) {
            alert('Gagal memproses request order, silakan periksa koneksi internet anda')
            console.log(err)
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <TouchableOpacity style={{flex: 2}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name={'chevron-left'} style={s.headerBackIcon} />
                            </TouchableOpacity>
                            <Txt style={s.headerText}>{"Form " + navigation.getParam('subCategory', 'kosong')}</Txt>
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{marginTop: 24, flexDirection: 'column'}}>
                                <Txt>Kode Mesin</Txt>
                                <TextInput
							        style={s.textInput}
							        placeholder="Kode Mesin"
							        autoCapitalize="none"
							        onChangeText={(kode_mesin) => this.setState({kode_mesin})}
							        value={this.state.kode_mesin}
							        placeholderTextColor="#d3d4cf" />
                                <Txt style={{ marginTop: 16 }}>Uraian dan deskripsi pekerjaan</Txt>
                                <TextInput
							        style={s.textArea}
							        placeholder="Uraian dan deskripsi pekerjaan"
							        autoCapitalize="none"
                                    multiline={true}
                                    numberOfLines={5}
                                    textAlignVertical={'top'}
							        onChangeText={(deskripsi) => this.setState({deskripsi})}
							        value={this.state.deskripsi}
							        placeholderTextColor="#d3d4cf" />
                                <Txt style={{ marginTop: 16 }}>Prioritas</Txt>
                                <Picker
                                    selectedValue={this.state.prioritas}
                                    itemStyle={s.textInput}
                                    style={s.textInput}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.setState({prioritas: itemValue})
                                    }>
                                    <Picker.Item label="Pilih Prioritas" value="" />
                                    <Picker.Item label="E (Urgent, harus segera dikerjakan)" value="E" />
                                    <Picker.Item label="1 (Maksimal 3 hari setelah disetujui)" value="1" />
                                    <Picker.Item label="2 (Maksimal 7 hari setelah disetujui)" value="2" />
                                    <Picker.Item label="3 (Maksimal 1 bulan setelah disetujui)" value="3" />
                                </Picker>
                                <Txt style={{ marginTop: 16, marginBottom: 8 }}>Ketentuan</Txt>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                      value={this.state.penghentianPabrik}
                                      onValueChange={() => this.setState({ penghentianPabrik: !this.state.penghentianPabrik })}
                                    />
                                    <Txt style={{marginTop: 5}}> Penghentian Operasi Pabrik</Txt>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                      value={this.state.panas}
                                      onValueChange={() => this.setState({ panas: !this.state.panas })}
                                    />
                                    <Txt style={{marginTop: 5}}> Ijin Pekerjaan Panas Disyaratkan</Txt>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                      value={this.state.dingin}
                                      onValueChange={() => this.setState({ dingin: !this.state.dingin })}
                                    />
                                    <Txt style={{marginTop: 5}}> Ijin Pekerjaan Dingin Disyaratkan</Txt>
                                </View>
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
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 16,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        flexDirection: 'column'
    },
    textInput: {
		fontSize: 16,
        width: WIDTH - 32,
        height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        borderColor: '#5794ff',
        borderWidth: 1,
		paddingStart: 16,
		paddingEnd: 16,
        color: 'rgba(51, 51, 51, 0.8)',
        top: 4
    },
    textArea: {
		fontSize: 16,
        width: WIDTH - 32,
        height: 100,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        borderColor: '#5794ff',
        borderWidth: 1,
		paddingStart: 16,
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