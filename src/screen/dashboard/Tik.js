import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Card from '../../component/Card';

import {style} from '../../../assets/styles/Style';

export default class Tik extends React.PureComponent {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            categoryTitle: [
                'PC',
                'Network',
                'SAP',
                'Non SAP',
                'Vidcon',
                'Printer',
                'CCTV',
                'Komunikasi',
                'Refill Toner'
            ],
            categoryIcon: [
                require('../../../assets/icons/tik/pc.png'),
                require('../../../assets/icons/tik/network.png'),
                require('../../../assets/icons/tik/sap.png'),
                require('../../../assets/icons/tik/non.png'),
                require('../../../assets/icons/tik/vidcon.png'),
                require('../../../assets/icons/tik/print.png'),
                require('../../../assets/icons/tik/cctv.png'),
                require('../../../assets/icons/tik/komunikasi.png'),
                require('../../../assets/icons/tik/refill.png'),
            ],
            categoryId: [
                'TI1',
                'TI2',
                'TI3',
                'TI4',
                'TI5',
                'TI6',
                'TI7',
                'TI8',
                'TI9'
            ],
            refreshing: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const CategoryTiles = this.state.categoryTitle.map((title, index) => {
            return (
                <View style={[style.col, style.col4]} key={index}>
                    <Card style={s.categoryTiles}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FormPok', {subCategory: this.state.categoryTitle[index], subCategoryId: this.state.categoryId[index]})}>
                            <Image source={this.state.categoryIcon[index]} style={s.categoryIcon} />
                            <Text numberOfLines={1} style={s.categoryTilesTitle}>{title}</Text>
                        </TouchableOpacity>
                    </Card>
                    
                </View>
            )
        })

        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <TouchableOpacity style={{flex: 2}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name={'chevron-left'} style={s.headerBackIcon} />
                            </TouchableOpacity>
                            <Text style={s.headerText}>Layanan TIK</Text>
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{marginTop: 24}}>
                                <View style={s.categoryColContainer}>
                                    {CategoryTiles}
                                </View>
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
        borderTopStartRadius: 28
    },
    categoryColContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginHorizontal: -4,
    },
    categoryTiles: {
        paddingVertical: 16,
        margin: 4,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        alignSelf: 'center',
    },
    categoryTilesTitle: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 13,
    },
    categorySectionTitle: {
        marginTop: 8,
    },
    categorySectionSubtitle: {
        marginTop: -4,
    },
})