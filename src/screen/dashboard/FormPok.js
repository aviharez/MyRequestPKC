import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    CheckBox,
    Button,
    Dimensions,
    Picker,
    Platform,
    TouchableNativeFeedback
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import {style} from '../../../assets/styles/Style';
import {Txt, TxtBold} from '../../component/Text';

const {width: WIDTH} = Dimensions.get('window');


class RequestBtn extends Component {
	render() {
		const {signInStatus, ...restProps} = this.props;
		const requestText = () => {
			if (signInStatus == 'processing') {
				return (<ActivityIndicator size="large" color='white' style={{marginVertical: 4}} />);
			} else {
				return (<TxtBold style={s.requestBtnTxt}>Submit</TxtBold>);
			}
		}

		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...restProps}>
					<View style={s.requestBtn}>
						{/* <TxtBold style={s.signInBtnTxt}>{signInStatus}</TxtBold> */}
						{/* <ActivityIndicator size="large" color='white' style={{marginVertical: 4}} /> */}
						{requestText()}
					</View>
				</TouchableNativeFeedback>
			);
		} else {
			return (
				<TouchableHighlight {...restProps}>
					<View style={s.requestBtn}>
						<TxtBold style={s.requestBtnTxt}>{signInStatus}</TxtBold>
					</View>
				</TouchableHighlight>
			);
		}
	}
}

export default class FormPok extends Component {

    constructor(props) {
        super(props);

        this.state = {
            kdmesin: '',
            description: '',
            priority: '',
            pop: false,
            dingin: false,
            panas: false
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
							        onChangeText={(kdmesin) => this.setState({kdmesin})}
							        value={this.state.kdmesin}
							        placeholderTextColor="#d3d4cf" />
                                <Txt style={{ marginTop: 16 }}>Deskripsi</Txt>
                                <TextInput
							        style={s.textInput}
							        placeholder="Deskripsi"
							        autoCapitalize="none"
							        onChangeText={(description) => this.setState({description})}
							        value={this.state.description}
							        placeholderTextColor="#d3d4cf" />
                                <Txt style={{ marginTop: 16 }}>Prioritas</Txt>
                                <Picker
                                    selectedValue={this.state.priority}
                                    itemStyle={s.textInput}
                                    style={s.textInput}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.setState({priority: itemValue})
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
                                      value={this.state.pop}
                                      onValueChange={() => this.setState({ pop: !this.state.pop })}
                                    />
                                    <Text style={{marginTop: 5}}> Penghentian Operasi Pabrik</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                      value={this.state.panas}
                                      onValueChange={() => this.setState({ panas: !this.state.panas })}
                                    />
                                    <Text style={{marginTop: 5}}> Ijin Pekerjaan Panas Disyaratkan</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                      value={this.state.dingin}
                                      onValueChange={() => this.setState({ dingin: !this.state.dingin })}
                                    />
                                    <Text style={{marginTop: 5}}> Ijin Pekerjaan Dingin Disyaratkan</Text>
                                </View>
                                <RequestBtn />
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