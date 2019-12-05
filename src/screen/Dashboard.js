import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    ScrollView,
    FlatList,
    ImageBackground,
    TextInput,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import bg from '../../assets/images/dashboard-bg.jpg';
import img from '../../assets/images/banner-bg.jpg';

import Card from '../component/Card';

import {style} from '../../assets/styles/Style';

const {width: WIDTH} = Dimensions.get('window');

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Syifa Nurzain',
      unit_name: 'Sekretaris Perusahaan',
      title: 'Perbaikan Iman Dan Takwa',
      status: 'E',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f66',
      name: 'Kevin Christianto',
      unit_name: 'Departemen Teknologi Informasi',
      title: 'Perbaikan gizi',
      status: '2',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Syifa Nurzain',
      unit_name: 'Departemen Humas',
      title: 'Perbaikan jaringan sosial masyarakat dalam kehidupan bermasyarakat di lingkungan sekitar',
      status: '3'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Syifa Nurzain',
      unit_name: 'Departemen Pengadaan',
      title: 'Perbaikan naon deui sok',
      status: '1',
    },
];

export default class Dashboard extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            requestQuery: '',
            categoryTitle: [
                'Bengkel',
                'Layanan TIK',
                'Listrik',
                'Umum',
                'Konsumsi',
                'Pinjam Kendaraan',
                'ATK',
                'Lainnya',
            ],
            categoryIcon: [
                require('../../assets/icons/menu/administrative_tools.png'),
                require('../../assets/icons/menu/monitor.png'),
                require('../../assets/icons/menu/lightning_bolt_2.png'),
                require('../../assets/icons/menu/accessibility.png'),
                require('../../assets/icons/menu/food.png'),
                require('../../assets/icons/menu/car.png'),
                require('../../assets/icons/menu/design.png'),
                require('../../assets/icons/menu/menu.png'),
            ],
            categoryNavigation: [
                'Bengkel',
                'TIK',
                'Listrik',
                'Umum',
                'Konsumsi',
                'Pinken',
                'ATK',
                'Lainnya',
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

        const LatestRequest = ({unit_name, title, status}) => {

            const statusBadgeBg = () => {
                if (status == 'E') {
                    return style.bgAccent4;
                } else if (status == 1) {
                    return style.bgAccent2;
                } else if (status == 2) {
                    return style.bgAccent1;
                } else {
                    return style.bgAccent3;
                }
            }

            return (
                <View style={{width: 200, justifyContent: 'center', backgroundColor: 'transparent',}}>
                    <Card style={[style.bgPrimary, s.requestTiles]}>
                        <TouchableOpacity>
                            <View style={{backgroundColor: 'transparent', flexDirection: 'row',}}>
                                <Text style={[statusBadgeBg(), s.requestStatusBadge,]}>{status}</Text>
                                <Text category='s2' style={{color: '#222B45', marginTop: 2, width: 130}} numberOfLines={1}>{unit_name}</Text>
                            </View>
                            <Text category='s1' numberOfLines={2} style={{height: 50, color: '#222B45', marginTop: 8}}>{title}</Text>
                            <Text category='s2' style={{color: '#222B45',}}>Nov 12, 2019</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            )
        }

        const CategoryTiles = this.state.categoryTitle.map((title, index) => {
            return (
                <View style={[style.col, style.col3]} key={index}>
                    <Card style={s.categoryTiles}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.categoryNavigation[index])}>
                            <Image source={this.state.categoryIcon[index]} style={s.categoryIcon} />
                            <Text numberOfLines={1} style={s.categoryTilesTitle}>{title}</Text>
                        </TouchableOpacity>
                    </Card>
                    
                </View>
            )
        })

        return (
            <View style={[style.mainContainer, s.whiteBg]}>
                <ScrollView style={{}}>
                    <View style={{}}>

                        <ImageBackground source={bg} style={s.headerContainer}>
                            <View style={s.bgOverlay} />
                            
                            <View style={s.hdeaderSearchbar}>
                                <TouchableOpacity>
                                    <Image source={require('../../assets/icons/user.png')} style={s.headerUser} />
                                </TouchableOpacity>
                                <View>
                                    <TextInput
							            style={s.textInput}
							            placeholder="Cari request di sini"
							            autoCapitalize="none"
							            onChangeText={(requestQuery) => this.setState({requestQuery})}
							            value={this.state.requestQuery}
							            autoFocus={true}
							            placeholderTextColor="#d3d4cf" />
						            <Icon name={'search'} style={s.inputIcon} />
                                </View>
                            </View>
                            <Text numberOfLines={2} style={s.headerText}>Buat Request Lebih Mudah Sekarang Juga</Text>
                        </ImageBackground>

                        <View style={[style.roundedTop, s.contentContainer]}>
                            <View>
                                <View style={s.categoryColContainer}>
                                    {CategoryTiles}
                                </View>
                            </View>
                        </View>

                        <View style={s.roundedBanner}>
                            <ImageBackground source={img} style={s.bannerContainer}>
                                <View style={s.bgOverlay} />
                                <View style={s.bannerContent}>
                                    <Text style={s.bannerText}>Cek request untukmu di sini</Text>
                                    <TouchableOpacity>
                                        <View style={s.circleArrow}>
                                            <Icon name={'arrow-right'} style={s.iconArrow} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={s.requestContainer}>
                            <View style={s.hdeaderSearchbar}>
                                <View style={s.requestSignTitle}/>
                                <Text style={s.requestTitle}>Request Terbaru</Text>
                            </View>
                            <View style={{marginHorizontal: -4, marginTop: 16, marginBottom: 16}}>
                                    <FlatList
                                        data={DATA}
                                        renderItem={({item}) => <LatestRequest unit_name={item.unit_name} title={item.title} status={item.status} />}
                                        keyExtractor={item => item.id}
                                        horizontal={true}
                                        contentContainerStyle={{paddingHorizontal: 16,}}
                                    />
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
        height: 200,
        padding: 16,
        flex: 1,
        flexDirection: 'column',
        // borderWidth: 1,
        // borderColor: 'red',
    },
    hdeaderSearchbar: {
        flex: 1,
        flexDirection: 'row'
    },
    headerUser: {
        width: 48,
        height: 48,
    },
    headerText: {
        fontSize: 20,
        width: 250,
        flex: 2,
        color: '#fff',
        top: 16,
        fontWeight: 'bold'
    },
    headerDescription: {
        color: '#fff',
        letterSpacing: 2,
        marginTop: -6,
    },
    contentContainer: {
        padding: 16,
        marginTop: -20,
        backgroundColor: '#fff'
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
        width: 36,
        height: 36,
        alignSelf: 'center',
    },
    categoryTilesTitle: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 12,
    },
    categorySectionTitle: {
        marginTop: 8,
    },
    categorySectionSubtitle: {
        marginTop: -4,
    },
    summaryContainer: {
        marginTop: 24,
        marginBottom: 32,
    },
    requestTiles: {
        marginHorizontal: 4,
        backgroundColor: 'rgba(136, 173, 236, .1)',
    },
    requestStatusBadge: {
        color: '#fff',
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 8,
    },
    textInputContainer: {
        marginBottom: 20,
    },
    textInput: {
		fontSize: 16,
        width: WIDTH - 90,
        height: 40,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		borderRadius: 24,
		paddingStart: 46,
		paddingEnd: 20,
        color: 'rgba(51, 51, 51, 0.8)',
        left: 8,
        top: 4
	},
	inputIcon: {
		color: '#d3d4cf',
		fontSize: 20,
		position: 'absolute',
		top: 13,
		left: 24
    },
    bgOverlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#acacac',
		opacity: 0.4
    },
    whiteBg:{
        backgroundColor: '#fff'
    },
    bannerContainer: {
        flex: 1,
        width: WIDTH - 36,
        marginLeft: 16,
        marginBottom: 16,
        marginTop: 8,
        height: 70,
        borderRadius: 16,
        borderBottomStartRadius: 16,
        overflow: 'hidden',
        alignItems: 'center'
    },
    bannerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    bannerText: {
        flex: 2,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        margin: 12,
        alignSelf: 'center',
    },
    circleArrow: {
        margin: 12,
        height: 42,
        width: 42,
        borderRadius: 24,
        backgroundColor: '#fff',
        alignSelf: 'center'
    },
    iconArrow: {
        color: '#5794ff',
		fontSize: 24,
        position: 'absolute',
        alignSelf: 'center',
        top: 8
    },
    roundedBanner: {
        borderRadius: 16
    },
    requestContainer: {
        marginTop: 16
    },
    requestSignTitle: {
        backgroundColor: '#5794ff',
        width: 6,
        height: 18,
        borderRadius: 16,
        left: 16
    },
    requestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        left: 24,
        top: -2
    }
})