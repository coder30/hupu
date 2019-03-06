import React from 'react';
import  MD5  from "react-native-md5";
import { View, FlatList , Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import LogoTitle from '../components/LogoTitle';
import Plate from '../components/Plate';
import {createMaterialTopTabNavigator} from 'react-navigation';
let nav;
class Loader extends React.Component {
  render() {
    return <View style={{flex: 1, padding: 20}}>
      <ActivityIndicator color ="#C01E2F"/>
    </View>
  }
}
class Tab1 extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: false, stamp: 0, lastTid: 0, flag: true, color: [], tab:0, plate: 0, addition_tid:-1};
  }
  getData() {
    var time = new Date().getTime();
    var res = "_ssid=PHVua25vd24gc3NpZD4=&additionTid="+this.state.additionTid+"&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&isHome=1&lastTid="+this.state.lastTid+"&nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&night=0&stamp="+this.state.stamp+"&time_zone=Asia/Shanghai&unfollowTid=HUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = "https://bbs.mobileapi.hupu.com/1/7.3.2/recommend/getThreadsList?nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&clientId=40834464&crt="+time+"&night=0&lastTid="+this.state.lastTid+"&sign="+sign+"&stamp="+this.state.stamp+"&_ssid=PHVua25vd24gc3NpZD4=&isHome=1&time_zone=Asia/Shanghai&additionTid="+this.state.additionTid+"&client=861608045774351&android_id=c515b866695fe8c3&unfollowTid="
    return fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson) => {
        for(var i=0; i<ResponseJson.result.data.length; i++){
          if(ResponseJson.result.data[i].badge && ResponseJson.result.data[i].badge[0].name=='广告'){
            ResponseJson.result.data.splice(i, 1);
          }
          else {
            ResponseJson.result.data[i].forum_logo.replace("\\", "")
          }
        }
        this.setState({
          dataSource :ResponseJson.result.data,
          stamp: ResponseJson.result.stamp,
          lastTid: ResponseJson.result.data[ResponseJson.result.data.length-1].tid,
          additionTid: ResponseJson.result.addition_tid,
          isLoading: false
        })
      })
  }
  async componentDidMount() {
    this.getData();
  }
  refreshmore() {
    this.setState({
      lastTid: 0
    },()=>{
      this.getData()
    });
  }
  onEndReached = () => {
    if(this.state.flag){
      this.setState({
        flag: false
      })
      var time = new Date().getTime();
      var res = "_ssid=PHVua25vd24gc3NpZD4=&additionTid=&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&isHome=0&lastTid="+this.state.lastTid+"&nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&night=0&stamp="+this.state.stamp+"&time_zone=Asia/Shanghai&unfollowTid=HUPU_SALT_AKJfoiwer394Jeiow4u309"
      var sign = MD5.hex_md5(res);
      var url = "https://bbs.mobileapi.hupu.com/1/7.3.2/recommend/getThreadsList?nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&clientId=40834464&crt="+time+"&night=0&lastTid="+this.state.lastTid+"&sign="+sign+"&stamp="+this.state.stamp+"&_ssid=PHVua25vd24gc3NpZD4=&isHome=0&time_zone=Asia/Shanghai&additionTid=&client=861608045774351&android_id=c515b866695fe8c3&unfollowTid="
      return fetch(url)
        .then((Response)=>Response.json())
        .then((ResponseJson) => {
          for(var i=0; i<ResponseJson.result.data.length; i++){
            if(ResponseJson.result.data[i].badge && ResponseJson.result.data[i].badge[0].name=='广告'){
              ResponseJson.result.data.splice(i, 1);
            }
            else {
              ResponseJson.result.data[i].forum_logo.replace("\\", "")
            }
          }
          var result = this.state.dataSource.concat(ResponseJson.result.data)
          this.setState({
            dataSource :result,
            stamp: ResponseJson.result.stamp,
            lastTid: ResponseJson.result.data[i-1].tid,
            flag: true,
          })
      })
    }
  }
  _scrollToTop = () => {
    if(!!this.flatListRef)
        this.flatListRef.scrollToOffset({ offset: 0, animated: true });
  }
  componentWillMount(){
    nav.setParams({
      scrollToTop: this._scrollToTop,
    });
  }
  render() {
    const { navigation } = this.props;
    return (
      <FlatList 
      data={this.state.dataSource} 
      ref={(ref) => { this.flatListRef = ref; }}
      extraData={this.state}
      showsVerticalScrollIndicator = {false}
      keyExtractor={(item, index) => 'key'+index}
      colors={['#C01E2F']}
      onRefresh={this.refreshmore.bind(this)}
      refreshing={this.state.isLoading}
      onEndReachedThreshold={0.5} 
      onEndReached={this.onEndReached.bind(this)} 
      onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }} 
      ListFooterComponent={Loader}
      renderItem={({item,index}) =>
        <TouchableOpacity  style={styles.card} onPress={() => { 
          var temp = this.state.color;
          temp[item.tid] = 'rgba(0, 0, 0, 0.38)';
          this.setState({color: temp});
          navigation.navigate('Details', { fid: item.fid, tid: item.tid, name: item.forum_name, logo: item.forum_logo})} 
        }>
          <View style={{ paddingBottom:5, flexDirection: 'row', paddingTop:5}}>
            <Image source={{uri: item.topic&&item.topic.logo||item.forum_logo}} style={{width: 25, height: 23, marginRight:5, borderRadius: 5}}/>
            <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12, height:25, lineHeight:25}}>{item.topic&&item.topic.topic_name||item.forum_name}</Text>
            <Text style={{color:'rgba(0, 0, 0, 0.38)', fontSize: 10, paddingLeft: 12, height:25, lineHeight:25}}>{item.userName}</Text>
          </View>
          <Text  style={{fontSize: 15, marginBottom: 5, color: this.state.color[item.tid]}}>{item.title}</Text>
          <View style={{flexDirection:'row', alignContent: 'center',marginTop: 10, color:'rgba(0, 0, 0, 0.38)'}}>
            <Image source={require('../assets/images/comment.png')} style={{width: 18, height: 18, marginRight:3, opacity:0.38}}/>
            <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)',fontSize:10, lineHeight:18}}>{item.replies}</Text>
            <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:3, opacity:0.38}}/>
            <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)',fontSize:10, lineHeight:18}}>{item.lightReply}</Text>
            {item.nps?
            <View style={{flexDirection: 'row'}}>
              <Image source={require('../assets/images/like.png')} style={{width: 18, height: 18, marginRight:3, opacity:0.38}}/>
              <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)',fontSize:10, lineHeight:18}}>{item.nps}</Text>
            </View>
            :null
            }
          </View>
      </TouchableOpacity>
      }/>
    );
  }
}
class Rectangle extends React.Component {
  render() {
    return <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:60, height: 22 ,margin: 12, alignItems: 'center'}}>
      <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22}}>{this.props.name}</Text>
    </ImageBackground>
  }
}
class Tint extends React.Component {
  render() {
    return <View style={{height:22, width:57}}>
      <Text style={{ color:"rgba(0, 0, 0, 0.54)", lineHeight: 22, textAlign: 'center'}}>{this.props.name}</Text>
    </View>
  }
}
const MyNavigator = createMaterialTopTabNavigator({
  TabOne: {
    screen:Tab1,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle name={'关注'}/>)
          else 
            return (<Tint name={'关注'}/>)
      },
    }
  },
  TabTwo: {
    screen:Plate,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => {
          if(focused)
            return (<Rectangle name={'板块'}/>)
          else 
            return (<Tint name={'板块'}/>)
      },
    }
  },
},{
  lazy :true,
  tabBarOptions:{
    scrollEnabled: true,
    showIcon: true,
    showLabel: false,
    indicatorStyle: {
      height: 2,
      backgroundColor: 'white',
    },//标签指示器的样式
    tabStyle :{width:80, height:45},
    style: {
      backgroundColor: '#fff',//TabBar 的背景颜色
    },
  },
})
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };
  constructor(props){
    super(props);
  }  
  static router = MyNavigator.router;
  componentWillMount(){
    nav = this.props.navigation
  }
  render() {
    return (
      <MyNavigator navigation={this.props.navigation}/>
    );
  }
}


const styles = StyleSheet.create({
  card: {
    borderBottomColor: '#F2F2F2',
    borderStyle: 'solid',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    paddingLeft: 10,
  }
})



