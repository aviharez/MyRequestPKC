// Component import
import React from 'react'
import {
	View,
	TextInput,
	StyleSheet,
	Image,
	Dimensions,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity,
	ImageBackground,
	ActivityIndicator,
	ToastAndroid,
	Alert,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

// Resource import
import logo from '../../assets/images/logo.png'
import bg from '../../assets/images/brainstorming-campaign-collaborate-6224.jpg'
import Icon from 'react-native-vector-icons/Ionicons'
import {Txt, TxtBold} from '../component/Text'
import {host} from '../config/ApiHost'

const {width: WIDTH} = Dimensions.get('window')

class SignInBtn extends React.PureComponent {
	render() {
		const {signInStatus, ...restProps} = this.props
		const signInText = () => {
			if (signInStatus == 'processing') {
				return (<ActivityIndicator size='large' color='white' style={{marginVertical: 4}} />)
			} else {
				return (<TxtBold style={s.signInBtnTxt}>Sign In</TxtBold>)
			}
		}

		if (Platform.OS === 'android') {
			return (
				<TouchableNativeFeedback {...restProps}>
					<View style={s.signInBtn}>
						{signInText()}
					</View>
				</TouchableNativeFeedback>
			)
		}
	}
}

export default class LoginPage extends React.PureComponent {
	_isMounted = false

	constructor(props) {
		super(props)

		this.state = {
			isPasswordVisible: false,
			username: null,
			password: null,
			signInStatus: 'default',
		}
	}

	componentDidMount() {
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	static navigationOption = {
		header: null
	}

	proceedLogin = async () => {
		if ((this.state.username == '' || this.state.username == null) || (this.state.password == '' || this.state.password == null)) {
			ToastAndroid.show('Harap isi username dan password anda', ToastAndroid.SHORT)
			return
		}

		var token = await AsyncStorage.getItem('fcmToken')
		if (!token || token == '') {
			ToastAndroid.show('Token notifikasi tidak ditemukan, silakan mulai ulang aplikasi.', ToastAndroid.SHORT)
			return
		}

		try {
			this.setState({signInStatus: 'processing'})
			let signInData = {
                'username': this.state.username,
                'password': this.state.password
            }
            let formData = []
            for (let property in signInData) {
                let encodedKey = encodeURIComponent(property)
                let encodedValue = encodeURIComponent(signInData[property])
    
                formData.push(encodedKey + '=' + encodedValue)
            }
			formData = formData.join('&')
			
			let response = await fetch('http://wbs.pupuk-kujang.co.id:8081/hrdmobile/app/login-v2/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData
			})
			response = await response.json()

			if (response.success == true) {
				this.submitToken(token)

				await AsyncStorage.multiSet([
					['logged', 'yes'],
					['nikSap', response.user.EMPLOYEEID],
					['namaPegawai', response.user.EMPLOYEENAME],
					['parentId', response.user.PARENTID],
					['parentName', response.user.PARENTNAME],
					['isParentPerson', response.user.PARENTPERSON ? 'yes' : 'no'],
					['accessToken', response.access_token]
				])
				this.props.navigation.navigate('app')
			} else if (response.error) {
				Alert.alert('Login Gagal', response.error.message)
			}
		} catch (err) {
			console.log(err)
			Alert.alert('Terjadi Kesalahan', 'Gagal memproses login, silakan periksa koneksi internet anda')
		}

		if (this._isMounted) {
			this.setState({signInStatus: 'default'})
		}
	}

	submitToken = async token => {
		try {
			let tokenData = {
                'token': token,
                'employee_id': this.state.username
            }
            let data = []
            for (let property in tokenData) {
                let encodedKey = encodeURIComponent(property)
                let encodedValue = encodeURIComponent(tokenData[property])
    
                data.push(encodedKey + '=' + encodedValue)
            }
			data = data.join('&')

			let response = await fetch(`${host}api/token-submit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: data
			})
			response = await response.json()

			if (!response.success) {
				ToastAndroid.show('Gagal menyimpan token ke server, silakan hubungi administrator', ToastAndroid.SHORT)
				return false
			}
		} catch (err) {
			console.log(err)
			ToastAndroid.show('Terjadi kesalahan', ToastAndroid.SHORT)
			return false
		}
	}

	render() {
		const {navigate} = this.props.navigation

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
							placeholder='Username'
							autoCapitalize='none'
							onChangeText={(username) => this.setState({username})}
							value={this.state.username}
							placeholderTextColor='rgba(51, 51, 51, 0.8)' />
						<Icon name={Platform.OS === 'android' ? 'md-person' : 'ios-person' } style={s.inputIcon} />
					</View>

					<View style={s.textInputContainer}>
						<TextInput
							style={s.textInput}
							placeholder='Password'
							onChangeText={(password) => this.setState({password})}
							value={this.state.password}
							autoCapitalize='none'
							secureTextEntry={this.state.isPasswordVisible == true ? false : true}
							placeholderTextColor='rgba(51, 51, 51, 0.9)' />
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
		)
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
})