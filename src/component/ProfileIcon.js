import React from 'react'
import {Icon, Badge} from 'react-native-elements'

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
        
const ProfileIcon = async props => {
    return (
        <IconWithBadge {...props} badgeCount={3} />
    )
}

export default ProfileIcon