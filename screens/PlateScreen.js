import React from 'react';
import MD5  from"react-native-md5";
import {View, Text, ActivityIndicator, FlatList, StyleSheet, Image, Dimensions ,ImageBackground, TouchableOpacity, StatusBar, TouchableWithoutFeedback} from'react-native';
var oldOffsetY = 0;
export default class Plate extends React.Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: '#fff'
    };
    constructor(props){
        super(props);
        this.state = {isLoading: true, page:1, dataSource:[], lastTid: '',color:[]}
    }
    async componentDidMount() {
        StatusBar.setBarStyle('light-content');
        const { navigation } = this.props;
        var fid = navigation.getParam('fid');
        var time = new Date().getTime();
        var res = "_ssid=PHVua25vd24gc3NpZD4=&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&fid="+fid+"&night=0&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
        sign = MD5.hex_md5(res);
        var url = "https://bbs.mobileapi.hupu.com/1/7.3.2/forums/getForumsAttendStatus?fid="+fid+"&clientId=40834464&crt="+time+"&night=0&sign="+sign+"&client=861608045774351&_ssid=PHVua25vd24gc3NpZD4%3D&time_zone=Asia%2FShanghai&android_id=c515b866695fe8c3"
        var result = await fetch(url);
        var resultJson = await result.json();
        this.setState({
            palteData: resultJson,
            type:resultJson.forumInfo.tab[0].type
        })
        this.getData(1);
    }
    getData(isHome, refresh){
        const { navigation } = this.props;
        var fid = navigation.getParam('fid');
        var time = new Date().getTime();
        res = "_ssid=PHVua25vd24gc3NpZD4=&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&entrance=-1&fid="+fid+"&isHome="+isHome+"&lastTid="+this.state.lastTid+"&night=0&page="+this.state.page+"&src_source=-1&stamp=&time_zone=Asia/Shanghai&type="+this.state.type+"HUPU_SALT_AKJfoiwer394Jeiow4u309"
        sign = MD5.hex_md5(res);
        url = "https://bbs.mobileapi.hupu.com/1/7.3.2/forums/getForumsInfoList?fid="+fid+"&clientId=40834464&crt="+time+"&night=0&lastTid="+this.state.lastTid+"&sign="+sign+"&stamp=&_ssid=PHVua25vd24gc3NpZD4%3D&isHome="+isHome+"&time_zone=Asia%2FShanghai&type="+this.state.type+"&client=861608045774351&page="+this.state.page+"&android_id=c515b866695fe8c3&entrance=-1&src_source=-1"
        fetch(url)
            .then((Response)=>Response.json())
            .then((ResponseJson)=>{
                var temp = this.state.color;
                console.log(url);
                for(let i=0; i<ResponseJson.result.data.length; i++){
                    if(ResponseJson.result.data[i].badge==undefined || ResponseJson.result.data[i].badge.length && ResponseJson.result.data[i].badge[0].name=='广告'){
                        ResponseJson.result.data.splice(i, 1);
                    }
                    else    
                        temp.push('black');
                }
                var data = this.state.dataSource.concat(ResponseJson.result.data);
                var page = this.state.page;
                this.setState({
                    color: temp,
                    isLoading: false,
                    dataSource: data,
                    lastTid: ResponseJson.result.data[ResponseJson.result.data.length-1].tid,
                    page: page+1
                })
            })
    }
    changeType(type){
        this.setState({
            dataSource: [],
            color: [],
            page:1,
            lastTid: '',
            type: type,
        },()=>{
            this.getData(1);
        });
        
    }
    onEndReached = () => {
        this.getData(0);
    }
    refreshmore() {
        this.setState({
            dataSource: [],
            color: [],
            page:1,
            lastTid: '',
        })
        this.getData(1);
    }
    _onScroll(e) {
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        console.log(offsetY, contentSizeHeight, oriageScrollHeight);
        if(offsetY>oldOffsetY){
            this.props.navigation.setParams({ header: null })
        }
        else {
            this.props.navigation.setParams({ header: <Text>123</Text> })
        }
        oldOffsetY = offsetY;
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
        return (
            <View>
                <View style={{backgroundColor: 'black', height: StatusBar.currentHeight}}></View>
                <FlatList 
                ListHeaderComponent={
                    <View>
                        <ImageBackground source={{uri: this.state.palteData.forumInfo.backImg}} style={{width:Dimensions.get("window").width, height: 200}}>
                        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.38)', height:200, padding:20,paddingTop:100}}>
                            <View style={{flexDirection:'row', marginBottom: 20, alignItems:'center'}}>
                                <Image source={{uri:this.state.palteData.forumInfo.logo}} style={{width:30, height:30, marginRight: 10}}/>
                                <Text style={{color: '#fff', fontSize:18}}>{this.state.palteData.forumInfo.name}</Text>
                                </View>
                            <Text style={{color: '#fff', fontSize:10}}>{this.state.palteData.forumInfo.description}</Text>
                        </View>
                        </ImageBackground>
                        <View>
                            <FlatList 
                                data={this.state.palteData.forumInfo.tab}
                                horizontal={true}
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={({item, index})=>
                                <TouchableOpacity onPress={()=>{this.changeType(item.type)}}>
                                    <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:70, height: 22 ,margin: 6, alignItems: 'center'}}>
                                    <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22, fontSize: 12}}>{item.name}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                }
                            />
                        </View>
                    </View>
                }
                data={this.state.dataSource}
                extraData={this.state}
                showsVerticalScrollIndicator = {false}
                keyExtractor={(item, index) => 'key'+index}
                onEndReachedThreshold={0.5} 
                onEndReached={this.onEndReached.bind(this)} 
                onRefresh={this.refreshmore.bind(this)}
                refreshing={this.state.isLoading}
                renderItem={({item, index})=>
                <TouchableOpacity  style={styles.card} onPress={() => { 
                    var temp = this.state.color;
                    temp[index] = 'rgba(0, 0, 0, 0.38)';
                    this.setState({color: temp});
                    navigation.navigate('Details', { fid: item.fid, tid: item.tid, name: item.forum_name, logo: item.forum_logo})} 
                  }>
                    <View style={{paddingBottom: 10, flexDirection: 'row', paddingTop:10, alignItems: 'center'}}>
                      <Text style={{color:'rgba(0, 0, 0, 0.38)', fontSize: 12}}>{item.userName}</Text>
                      <Text style={{color:'rgba(0, 0, 0, 0.38)', fontSize: 10, paddingLeft: 10}}>{item.time}</Text>
                    </View>
                    <Text  style={{fontSize: 14, marginBottom: 5, color: this.state.color[index]}}>{item.title}</Text>
                    <View style={{flexDirection:'row', alignContent: 'center', marginTop: 10, color:'rgba(0, 0, 0, 0.38)'}}>
                      <Image source={require('../assets/images/comment.png')} style={{width: 18, height: 18, marginRight:6, opacity:0.38}}/>
                      <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)', fontSize:11, lineHeight: 18}}>{item.replies}</Text>
                      <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:6, opacity:0.38}}/>
                      <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)', fontSize:11, lineHeight: 18}}>{item.lightReply}</Text>
                    </View>
                </TouchableOpacity>
                }/>
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator color ="#C01E2F"/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
      borderBottomColor: '#F2F2F2',
      borderStyle: 'solid',
      borderBottomWidth: 0.5,
      paddingBottom: 10,
      paddingLeft: 10,
    }
})
  