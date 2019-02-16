import React from 'react';
import  MD5  from "react-native-md5";
import { View, FlatList ,ActivityIndicator, Text, Image, TouchableOpacity, Dimensions, ImageBackground, ScrollView, StatusBar} from 'react-native';

export default class TopicScreen extends React.Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: '#fff'
    };
    constructor(props){
        super(props);
        this.state = {isLoading: true, nid: 0, count: 0};
    }
    getData() {
        const { navigation } = this.props;
        const nid = navigation.getParam('nid');
        var time = new Date().getTime();
        var res = "cate_type=news&channel=hupucom&client=316810195181635&crt="+time+"&entrance=1&html=0&nid="+nid+"&night=0&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        var url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getSubjectNewsDetail?crt="+time+"&night=0&channel=hupucom&nid="+nid+"&sign="+sign+"&client=316810195181635&html=0&time_zone=Asia/Shanghai&cate_type=news&entrance=1"
        return fetch(url)
          .then((Response)=>Response.json())
          .then((ResponseJson)=>{
                this.setState({
                isLoading: false,
                dataSource :ResponseJson.result
            })
          })
    }
    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        this.getData()
    }
    render() {
        const { navigation } = this.props;
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator color ="#C01E2F"/>
              </View>
            )
        }
        return(
            <View>
            <View style={{backgroundColor: 'black', height: StatusBar.currentHeight}}></View>
            <ScrollView style={{marginBottom: 30}}>
                <ImageBackground source={{uri: this.state.dataSource.img_m}} imageStyle={{opacity:1}} style={{width:Dimensions.get("window").width,  height: Dimensions.get("window").width*202/360, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 18, marginLeft: 30,marginRight:30, lineHeight:30}}>{this.state.dataSource.title}</Text>
                </ImageBackground>
                <FlatList
                    data={this.state.dataSource.groups}
                    keyExtractor={(item, index) => 'key'+index}
                    style={{marginRight: 15, marginLeft: 15}}
                    showsVerticalScrollIndicator = {false}
                    renderItem={({item}) =>
                    <View>
                        <View style={{marginTop: 10 ,flexDirection:'row'}}>
                            <Text style={{color:'#C01D2E', fontSize:18, fontWeight: '400'}}>{item.title.slice(0,1)}</Text>
                            <Text style={{color:"rgba(0, 0, 0, 0.54)", fontSize:18}}>{item.title.slice(1,4)}</Text>
                            <Text style={{lineHeight: 25}}>{item.title.slice(4)}</Text>
                        </View>
                        <FlatList 
                            data={item.news}
                            keyExtractor={(item, index) => 'key'+index}
                            renderItem={({item}) =>
                            <TouchableOpacity style={{flexDirection:'row', paddingTop:10, paddingBottom:10, marginBottom:4}} onPress={() =>  {item.type==1?navigation.navigate('News', { nid: item.nid, replies: item.replies}): navigation.navigate('Details', { name:'湿乎乎的话题',fid: 1048, tid: item.link.slice(19,27)})}}>
                                <Image source={{uri:item.img||item.thumbs[0]}} style={{width:90, height:70}}/>
                                <View style={{flexDirection:"column", justifyContent: "space-between", flex:1}}>
                                <Text style={{marginLeft:10}}>{item.title}</Text>
                                <View style={{flexDirection:"row", marginLeft:10}}>
                                    <Image source={require('../assets/images/comment.png')} style={{width: 11, height:14, opacity:0.38, marginRight: 7}}/>
                                    <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)', fontSize: 14,height:14, lineHeight:14}}>{item.replies}</Text>
                                    <Image source={require('../assets/images/light.png')} style={{width: 11, height:14, opacity:0.38, marginRight: 7}}/>
                                    <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)', fontSize: 14,height:14, lineHeight:14}}>{item.lights}</Text>
                                </View>
                                </View>
                            </TouchableOpacity>
                        }/>
                    </View>
                }/> 
            </ScrollView>
            </View>
        )
    }
}