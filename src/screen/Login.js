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
	StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation-stack';


// Resource import
import logo from '../../assets/images/logo.png';
import bg from '../../assets/images/brainstorming-campaign-collaborate-6224.jpg';
import Icon from 'react-native-vector-icons/Ionicons';
import {Txt, TxtBold} from '../component/Text';

// Page import
import Router from '../Router.js';
import { createAppContainer } from 'react-navigation';


const {width: WIDTH} = Dimensions.get('window');

class SignInBtn extends Component {
	render() {
		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...this.props}>
					<View style={s.signInBtn}>
						<TxtBold style={s.signInBtnTxt}>Sign In</TxtBold>
					</View>
				</TouchableNativeFeedback>
			);
		} else {
			return (
				<TouchableHighlight {...this.props}>
					<View style={s.signInBtn}>
						<TxtBold style={s.signInBtnTxt}>Sign In</TxtBold>
					</View>
				</TouchableHighlight>
			);
		}
	}
}

export default class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPasswordVisible: false,
			username: '',
			password: ''
		}
	}

	static navigationOption = {
		header: null
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
							autoFocus={true}
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

					<SignInBtn onPress={() => navigate('app')} />
				</View>
			</ImageBackground>
		);
	}

	// _signIn = async () => {
	// 	let response = await fetch('http://192.168.56.102/spokApi/apicontroller/checkLogin', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             username: this.state.username,
    //             password: this.state.password,
    //         }),
    //     });
	// 	const json = await response.json();

	// 	// alert(json.status);
	// 	if (json.status === 'success') {
	// 		let username = json.data.username;
	// 		let kd_biaya = username.substr(3);

	// 		response = await fetch('http://192.168.56.102/spokApi/apicontroller/getIdExecutor/' + kd_biaya);
	// 		const json2 = await response.json();

	// 		await AsyncStorage.multiSet([
	// 			['logged', 'yes'], 
	// 			['username', username], 
	// 			['unitKerja', json.data.unit_name],
	// 			['idExecutor', json2.id]
	// 		]);
	// 		this.props.navigation.navigate('app');
	// 	} else {
	// 		alert('Username atau password salah');
	// 	}
	// }
	
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