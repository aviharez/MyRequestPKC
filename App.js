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
} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import bg from './assets/images/brainstorming-campaign-collaborate-6224.jpg';
import logo from './assets/images/logo.png';
import {Txt} from './src/component/Text';

import loginScreen from './src/screen/Login.js';
import routerScreen from './src/Router.js';

const userInfo = {username: 'admin', password: 'admin'};

class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this._loadData();
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
        this.props.navigation.navigate('auth');
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