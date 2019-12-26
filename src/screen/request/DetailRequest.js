import React, {Component} from 'react';
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

import {Txt, TxtBold} from '../../component/Text';

export default class DetailRequest extends Component {

    render() {

        return (
            <View style={[style.mainContainer]}>
                <ScrollView>
                    <View>
                        <View style={s.headerContainer}>
                            <TouchableOpacity style={{flex: 2}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name={'chevron-left'} style={s.headerBackIcon} />
                            </TouchableOpacity>
                            <View style={{ flex: 1, marginTop: -16, left: 8 }}>
                                <TxtBold style={s.headerText}>Kode atau Nomor Mesin</TxtBold>
                                <Txt style={{fontSize: 18, color: '#fff'}}>Nama Subkategori</Txt>
                            </View>
                            
                        </View>

                        <View style={s.contentContainer}>
                            <View style={{flexDirection: 'column'}}>
                                <TouchableOpacity>
                                    <View style={{ 
                                        backgroundColor: '#ffaa0d', 
                                        width: 120, 
                                        height: 45, 
                                        borderRadius: 24,
                                        alignSelf: 'flex-end',
                                        marginTop: -38,
                                        marginRight: 12
                                    }}>
                                        <Txt style={{ 
                                            color: '#fff', 
                                            fontSize: 18, 
                                            alignContent: 'center', 
                                            alignSelf: 'center',
                                            marginTop: 12
                                        }}>Accept</Txt>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ padding: 16 }}>
                                    <Txt style={{ fontSize: 16, marginTop: 16 }}>Ini adalah deskripsi untuk mendeskripsikan masalah yang terjadi pada yang dideskripsikan</Txt>
                                    <View style={{ marginTop: 24, marginBottom: 16, backgroundColor: '#cccbc7', width: '100%', height: 1 }}></View>
                                    <View style={{ flexDirection: 'row', marginLeft: -4, marginBottom: 16 }}>
                                        <Image source={require('../../../assets/icons/user.png')} style={{width: 40, height: 40, tintColor: '#5794ff'}} />
                                        <View style={{ flexDirection: 'column', marginLeft: 8, alignContent: 'center', alignSelf: 'center' }}>
                                            <Txt style={{ color: '#000', fontSize: 16 }}>Nama yang minta</Txt>
                                            <Txt style={{ color: '#cccbc7', fontSize: 13 }}>Nama departemen yang minta</Txt>
                                        </View>
                                    </View>
                                    <TxtBold style={{ fontSize: 16 }}>Ketentuan</TxtBold>
                                    <Txt style={{ fontSize: 14 }}>- Pemberhentian operasi pabrik</Txt>
                                    <Txt style={{ fontSize: 14 }}>- Ijin pekerjaan panas disyaratkan</Txt>
                                    <Txt style={{ fontSize: 14 }}>- Ijin pekerjaan panas disyaratkan</Txt>
                                    
                                    <View style={{ marginTop: 24, marginBottom: 16, backgroundColor: '#cccbc7', width: '100%', height: 1 }}></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name={'calendar'} style={{ fontSize: 16, alignSelf: 'center', color: '#5794ff' }} />
                                        <Txt style={{ fontSize: 16, marginLeft: 8 }}>2019-12-12</Txt>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                        <Icon name={'alert-circle'} style={{ fontSize: 16, alignSelf: 'center', color: '#5794ff' }} />
                                        <Txt style={{ fontSize: 16, marginLeft: 8 }}>E (Urgent, harus segera dikerjakan)</Txt>
                                    </View>
                                    <TxtBold style={{ fontSize: 16, marginTop: 24 }}>Status Request</TxtBold>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diapprove Oleh</Txt>
                                            <Txt style={{ fontSize: 14 }}>nama orang yang approve</Txt>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Tanggal Approve</Txt>
                                            <Txt style={{ fontSize: 14 }}>2019-12-12</Txt>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diterima Oleh</Txt>
                                            <Txt style={{ fontSize: 14 }}>nama orang yang nerima</Txt>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Tanggal Diterima</Txt>
                                            <Txt style={{ fontSize: 14 }}>2019-12-12</Txt>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Txt style={{ color: '#cccbc7', fontSize: 12 }}>Diselesaikan Pada</Txt>
                                            <Txt style={{ fontSize: 14 }}>2019-12-12</Txt>
                                        </View>
                                    </View>
                                    <TxtBold style={{ fontSize: 16, marginTop: 24 }}>Keterangan</TxtBold>
                                    <View style={{
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#cccbc7',
                                        width: '100%',
                                        height: 100,
                                        marginVertical: 8
                                    }}>
                                        <Txt style={{ margin: 8 }}>Isi Keterangan</Txt>
                                    </View>
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
        height: 300,
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
        width: 300,
        color: '#fff',
    },
    contentContainer: {
        padding: 16,
        marginTop: -24,
        backgroundColor: '#fff',
        borderTopStartRadius: 28,
        borderTopEndRadius: 28
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