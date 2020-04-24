import React from 'react'
//import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import {Icon, Badge} from 'react-native-elements'
import Global from './config/Global'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import Dashboard from './screen/Dashboard'
import Bengkel from './screen/dashboard/Bengkel'
import TIK from './screen/dashboard/Tik'
import Listrik from './screen/dashboard/Listrik'
import Umum from './screen/dashboard/Umum'
import Konsumsi from './screen/dashboard/Konsumsi'
import Pinken from './screen/dashboard/PinKen'
import ATK from './screen/dashboard/Atk'
import Lainnya from './screen/dashboard/Menu'
import MyRequest from './screen/MyRequest'
import Notification from './screen/Notifcation'
import Profile from './screen/Profile'
import FormPok from './screen/form/FormPok'
import DetailRequest from './screen/request/DetailRequest'
import Approval from './screen/approval/Approval'
import FormVenue from './screen/form/FormVenue'

export default bottomTabNavigator = createBottomTabNavigator(
  {
    Home: createStackNavigator({
      Dashboard,
      Bengkel,
      TIK,
      Listrik,
      Umum,
      Konsumsi,
      Pinken,
      ATK,
      Lainnya,
      FormPok,
      FormVenue,
    }, {
      defaultNavigationOptions: {
        header: null
      }
    }),
    MyRequest: createStackNavigator({
      MyRequest, 
      DetailRequest
    }, {
      defaultNavigationOptions: {
        header: null
      }
    }),
    Notification: Notification,
    Profile: createStackNavigator({
      Profile,
      Approval,
      DetailRequest
    }, {
      defaultNavigationOptions: {
        header: null
      }
    })
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        let IconComponent = Icon
        let iconName
        if (routeName === 'Home') {
          iconName = 'home'
        } else if (routeName === 'MyRequest') {
          iconName = 'clipboard'
        }  else if (routeName === 'Notification') {
          iconName = 'bell'
        } else if (routeName === 'Profile') {
          iconName = 'user'
          IconComponent = ProfileIcon
        } 

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={20} color={tintColor} type='feather' />
      },
    }),
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#5794ff',
      inactiveTintColor: '#d2d3ce',
      style: {
        shadowColor: 'rgba(58,55,55,0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 3,
        shadowRadius: 15,
        elevation: 3,
        borderTopColor: 'transparent',
        backgroundColor:'#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 55,
        padding: 4
      },
    },
  }
)

const AppContainer = createAppContainer(bottomTabNavigator)

class IconWithBadge extends React.PureComponent {
  render() {
      return (
          <React.Fragment>
              <Icon name={this.props.name} size={this.props.size} color={this.props.color} type={this.props.type} />
              {this.props.badgeCount > 0 && (
                  <Badge status='error' containerStyle={{position: 'absolute', top: 2, right: 32}} />
              )}
          </React.Fragment>
      )
  }
}

class ProfileIcon extends React.PureComponent {
  state = {
    count: 0
  }  

  render () {
    Global.badgeCount = this
    return (
      <IconWithBadge {...this.props} badgeCount={this.state.count} />
    )
  }
}