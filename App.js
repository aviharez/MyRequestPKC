import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
	  View,
    ImageBackground,
	  Image,
	  ActivityIndicator,
} from 'react-native';
import {
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'

import bg from './assets/images/brainstorming-campaign-collaborate-6224.jpg'
import logo from './assets/images/logo.png'
import {Txt} from './src/component/Text'

import loginScreen from './src/screen/Login.js'
import routerScreen from './src/Router.js'

class AuthLoadingScreen extends Component {
    constructor(props) {
		super(props);
		
		this.checkPermission()
		this._loadData()
		this.notificationListener()
	}

	notificationListener = async () => {
		this.messageListener = firebase.messaging().onMessage(async (message) => {
			alert(JSON.stringify(message))
		})

		this.notificationListener = firebase.messaging().onMessage((message) => {
			console.log(JSON.stringify(message))
		})
	}
	
	checkPermission = async () => {
		const enabled = await firebase.messaging().hasPermission()

		if (enabled) {
			this.getToken()
		} else {
			this.requestPermission()
		}
	}

	getToken = async () => {
		let fcmToken = await AsyncStorage.getItem('fcmToken');

		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();

			if (fcmToken) {
				// User has device token
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}

		console.log(await AsyncStorage.getItem('fcmToken'))
	}

	requestPermission = async () => {
		try {
			await firebase.messaging().requestPermission();

			// User authorized
			this.getToken();
		} catch (err) {
			console.log('Permission rejected');
		}
	}

    render() {
        return (

			<ImageBackground source={bg} style={s.container}>
				<View style={s.bgOverlay} />
                <View style={s.logoContainer}>
					<Image source={logo} style={s.logo} />
					<Txt style={s.signInText}>My Request Pupuk Kujang</Txt>
					<ActivityIndicator size="large" color="#00bcd4" />
					<Txt style={{color: '#fff', fontSize: 18}}>Menghubungkan</Txt>
				</View>
			</ImageBackground>
        );
    }

    _loadData = async () => {
        const logged = await AsyncStorage.getItem('logged');
        this.props.navigation.navigate(logged ? 'app' : 'auth');
    }
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
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
	signInText: {
		marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
		letterSpacing: 2,
		color: '#fff',
		fontFamily: 'Product Sans'
	},
	logo: {
		width: 96,
		height: 96
	},
});

export default createAppContainer(createSwitchNavigator({
    authCheck: AuthLoadingScreen,
    app: routerScreen,
	auth: loginScreen
},
{
    initialRouteName: 'authCheck'
}));