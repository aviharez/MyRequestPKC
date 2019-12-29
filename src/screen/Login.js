// Component import
import React, { Component } from 'react';
import {
	View,
	Button,
	ScrollView,
	TextInput,
	StyleSheet,
	Image,
	Dimensions,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity,
	ImageBackground,
	ActivityIndicator,
	StatusBar,
	ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation-stack';


// Resource import
import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/brainstorming-campaign-collaborate-6224.jpg';
import Icon from 'react-native-vector-icons/Ionicons';
import {Txt, TxtBold} from '../component/Text';
import {host} from '../config/ApiHost';

// Page import
import Router from '../Router.js';
import { createAppContainer } from 'react-navigation';


const {width: WIDTH} = Dimensions.get('window');

class SignInBtn extends Component {
	render() {
		const {signInStatus, ...restProps} = this.props;
		const signInText = () => {
			if (signInStatus == 'processing') {
				return (<ActivityIndicator size="large" color='white' style={{marginVertical: 4}} />);
			} else {
				return (<TxtBold style={s.signInBtnTxt}>Sign In</TxtBold>);
			}
		}

		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...restProps}>
					<View style={s.signInBtn}>
						{signInText()}
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

export default class LoginPage extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			isPasswordVisible: false,
			username: null,
			password: null,
			signInStatus: 'default',
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	static navigationOption = {
		header: null
	}

	proceedLogin = async () => {
		if ((this.state.username == '' || this.state.username == null) || (this.state.password == '' || this.state.password == null)) {
			alert('Username atau password belum diisi');
			return;
		}

		try {
			this.setState({signInStatus: 'processing'});
			let response = await fetch(host + 'api/auth', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					nikSap: this.state.username,
					password: this.state.password,
				})
			});
			response = await response.json();

			if (response.status == 'success') {
				const fcmToken = await AsyncStorage.getItem('fcmToken')
				let tokenResponse = await fetch(host + "api/submitDeviceToken", {
					method: "POST",
					body: JSON.stringify({
						"deviceToken": fcmToken,
						"nikSap": this.state.username
					})
				});

				tokenResponse = await tokenResponse.json();
				message = null;
				if (tokenResponse.status == 'tokenValid') {
					message = "Token valid";
				} else if (tokenResponse.status == 'insertSuccess') {
					message = "Device token saved";
				} else if (tokenResponse.status == 'nikSapUpdated') {
					message = 'Token is already exist, old nikSap replaced';
				} else {
					message = 'Something went wrong when processing device token';
				}
				ToastAndroid.show(message, ToastAndroid.SHORT);

				await AsyncStorage.multiSet([
					['logged', 'yes'],
					['nikSap', response.nikSap],
					['namaPegawai', response.namaPegawai],
					['unitId', response.unitId],
					['posTitle', response.posTitle],
					['isUnitHead', response.isUnitHead]
				]);
				this.props.navigation.navigate('app');
			} else if (response.status == 'wrongNikSap') {
				alert('Nik SAP anda salah, silakan periksa kembali');
				this.setState({username: null});
			} else if (response.status == 'wrongPassword') {
				alert('Password anda salah, silakan periksa kembali');
				this.setState({password: null});
			}
		} catch (err) {
			console.log(err)
			alert('Gagal memproses login, silakan periksa koneksi internet anda');
		}

		if (this._isMounted) {
			this.setState({signInStatus: 'default'});
		}
	}

	render() {
		const {navigate} = this.props.navigation;

		return (
			<ImageBackground source={bg} style={s.mainContainer}>
				<View style={s.bgOverlay} />
				<View style={s.logoContainer}>
					<Image source={logo} style={s.logo} />
					<Txt style={s.signInTitle}>Sign In</Txt>
					<Txt style={s.signInText}>My Request Pupuk Kujang</Txt>
				</View>

				<View style={s.formContainer}>
					<View style={s.textInputContainer}>
						<TextInput
							style={s.textInput}
							placeholder="Username"
							autoCapitalize="none"
							onChangeText={(username) => this.setState({username})}
							value={this.state.username}
							placeholderTextColor="rgba(51, 51, 51, 0.8)'" />
						<Icon name={Platform.OS === 'android' ? 'md-person' : 'ios-person' } style={s.inputIcon} />
					</View>

					<View style={s.textInputContainer}>
						<TextInput
							style={s.textInput}
							placeholder="Password"
							onChangeText={(password) => this.setState({password})}
							value={this.state.password}
							autoCapitalize="none"
							secureTextEntry={this.state.isPasswordVisible == true ? false : true}
							placeholderTextColor="rgba(51, 51, 51, 0.9)'" />
						<Icon name={Platform.OS === 'android' ? 'md-key' : 'ios-key' } style={s.inputIcon} />
						<TouchableOpacity style={s.showHidePassword} onPress={() => {
							this.setState({isPasswordVisible: !this.state.isPasswordVisible})
						}}>
							<View>
								<Icon
									name={
										Platform.OS === 'android' ? 
										(this.state.isPasswordVisible == true ? 'md-eye' : 'md-eye-off') : 
										(this.state.isPasswordVisible == true ? 'ios-eye' : 'ios-eye-off')
									}
									style={{fontSize: 22, color: 'rgba(51, 51, 51, 0.8)'}}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<SignInBtn onPress={this.proceedLogin} signInStatus={this.state.signInStatus} />
				</View>
			</ImageBackground>
		);
	}
	
}

const s = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(51, 51, 51, .8)'
	},
	logo: {
		width: 96,
		height: 96
	},
	bgOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'black',
		opacity: 0.6
	},
	logoContainer: {
		alignItems: 'center',
		marginTop: -80
	},
	signInTitle: {
		fontSize: 32,
		fontWeight: 'bold',
		letterSpacing: 2,
		color: '#fff'
	},
	signInText: {
		fontSize: 18,
		letterSpacing: 2,
		color: '#fff',
	},
	formContainer: {
		marginTop: 40
	},
	textInput: {
		fontSize: 16,
		width: WIDTH - 80,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 24,
		paddingStart: 46,
		paddingEnd: 40,
		color: 'rgba(51, 51, 51, 0.8)'
	},
	inputIcon: {
		color: 'rgba(51, 51, 51, 0.8)',
		fontSize: 22,
		position: 'absolute',
		top: 13,
		left: 19
	},
	textInputContainer: {
		marginBottom: 20
	},
	signInBtn: {
		backgroundColor: '#5794ff',
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center'
	},
	signInBtnTxt: {
		fontSize: 18,
		letterSpacing: 1,
		paddingVertical: 12,
		color: '#fff',
	},
	showHidePassword: {
		position: 'absolute',
		top: 13,
		right: 14,
	}
});