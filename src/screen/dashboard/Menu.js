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
import {Txt} from '../../component/Text';

import {style} from '../../../assets/styles/Style';

export default class Menu extends React.PureComponent {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            pokTitle: [
                'Pemeliharaan Lapangan',
                'Bengkel',
                'Laboratorium',
                'KPK',
                'Listrik',
                'Layanan TIK',
                'Inspeksi',
                'Jasa Teknik',
                'Process Engineering',
                'Produksi',
                'PAM',
                'Instrumen',
                'Rancang Bangun',
                'Umum'
            ],
            pokIcon: [
                require('../../../assets/icons/bengkel/permesinan.png'),
                require('../../../assets/icons/menu/administrative_tools.png'),
                require('../../../assets/icons/bengkel/pertukangan.png'),
                require('../../../assets/icons/bengkel/permesinan.png'),
                require('../../../assets/icons/menu/lightning_bolt_2.png'),
                require('../../../assets/icons/menu/monitor.png'),
                require('../../../assets/icons/bengkel/permesinan.png'),
                require('../../../assets/icons/bengkel/perpipaan.png'),
                require('../../../assets/icons/bengkel/pertukangan.png'),
                require('../../../assets/icons/bengkel/permesinan.png'),
                require('../../../assets/icons/bengkel/perpipaan.png'),
                require('../../../assets/icons/bengkel/pertukangan.png'),
                require('../../../assets/icons/bengkel/permesinan.png'),
                require('../../../assets/icons/menu/accessibility.png'),
            ],
            pokNav: [
                'Pemeliharaan Lapangan',
                'Bengkel',
                'Laboratorium',
                'KPK',
                'Listrik',
                'TIK',
                'Inspeksi',
                'Jasa Teknik',
                'Process Engineering',
                'Produksi',
                'PAM',
                'Instrumen',
                'Rancang Bangun',
                'Umum'
            ],

            nonTitle: [
                'Accomodation',
                'Venue',
                'Transportation',
                'Food & Beverage',
                // 'Perbaikan Kendaraan',
                // 'ATK'
            ],
            nonIcon: [
                require('../../../assets/icons/umum/accomodation.png'),
                require('../../../assets/icons/umum/meeting_room.png'),
                require('../../../assets/icons/umum/car.png'),
                require('../../../assets/icons/umum/food.png'),
                // require('../../../assets/icons/bengkel/perpipaan.png'),
                // require('../../../assets/icons/menu/design.png'),
            ],
            nonNav: [
                'FormAccomodation',
                'FormVenue',
                'FormTransportation',
                'FormFoodBeverage',
                // 'Perbaikan Kendaraan',
                // 'ATK'
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

        const PokTiles = this.state.pokTitle.map((title, index) => {
            return (
                <View style={[style.col, style.col13]} key={index}>
                    <Card style={s.categoryTiles}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.pokNav[index])}>
                            <Image source={this.state.pokIcon[index]} style={s.categoryIcon} />
                            <Text numberOfLines={2} style={s.categoryTilesTitle}>{title}</Text>
                        </TouchableOpacity>
                    </Card>
                    
                </View>
            )
        })

        const NonTiles = this.state.nonTitle.map((title, index) => {
            return (
                <View style={[style.col, style.col13]} key={index}>
                    <Card style={s.categoryTiles}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.nonNav[index])}>
                            <Image source={this.state.nonIcon[index]} style={s.categoryIcon} />
                            <Text numberOfLines={2} style={s.categoryTilesTitle}>{title}</Text>
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
                            <Text style={s.headerText}>Menu</Text>
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{marginTop: 24}}>
                                <View style={s.headerSearchbar}>
                                    <View style={s.requestSignTitle}/>
                                    <Txt style={s.requestTitle}>Permintaan Order Kerja (POK)</Txt>
                                </View>
                                <View style={s.categoryColContainer}>
                                    {PokTiles}
                                </View>
                                <View style={s.headerSearchbar}>
                                    <View style={s.requestSignTitle}/>
                                    <Txt style={s.requestTitle}>Non POK (Umum)</Txt>
                                </View>
                                <View style={s.categoryColContainer}>
                                    {NonTiles}
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
    headerSearchbar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    contentContainer: {
        padding: 16,
        marginTop: -20,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        flexDirection: 'column'
    },
    categoryColContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    categoryTiles: {
        paddingVertical: 16,
        margin: 4,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        alignSelf: 'center',
    },
    categoryTilesTitle: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 11,
    },
    categorySectionTitle: {
        marginTop: 8,
    },
    categorySectionSubtitle: {
        marginTop: -4,
    },
    requestSignTitle: {
        backgroundColor: '#5794ff',
        width: 6,
        height: 18,
        borderRadius: 16,
        marginLeft: 8
    },
    requestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    }
})