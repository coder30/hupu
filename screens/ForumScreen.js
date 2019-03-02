import React from 'react';
import  MD5  from "react-native-md5";
import { View, FlatList ,ActivityIndicator, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Dimensions} from 'react-native';
import LogoTitle from '../components/LogoTitle'
let gestureHandlers = {};

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };
  constructor(props){
    super(props);
    this.config = {changeX: 0}
    this.state = {isLoading: true, stamp: 0, lastTid: 0, flag: true, color: [], tab:0, plate: 0, addition_tid:-1};
    this.onEndReachedCalledDuringMomentum = true; 
  }
  getData() {
    var time = new Date().getTime();
    var res = "_ssid=PHVua25vd24gc3NpZD4=&additionTid="+this.state.additionTid+"&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&isHome=1&lastTid="+this.state.lastTid+"&nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&night=0&stamp="+this.state.stamp+"&time_zone=Asia/Shanghai&unfollowTid=HUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = "https://bbs.mobileapi.hupu.com/1/7.3.2/recommend/getThreadsList?nav=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&clientId=40834464&crt="+time+"&night=0&lastTid="+this.state.lastTid+"&sign="+sign+"&stamp="+this.state.stamp+"&_ssid=PHVua25vd24gc3NpZD4=&isHome=1&time_zone=Asia/Shanghai&additionTid="+this.state.additionTid+"&client=861608045774351&android_id=c515b866695fe8c3&unfollowTid="
    this.getForum();
    return fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson) => {
        var temp = [];
        console.log(url);
        for(var i=0; i<ResponseJson.result.data.length; i++){
          if(ResponseJson.result.data[i].badge && ResponseJson.result.data[i].badge[0].name=='广告'){
            ResponseJson.result.data.splice(i, 1);
          }
          else {
            ResponseJson.result.data[i].forum_logo.replace("\\", "")
            temp.push('black')
          }
        }
        this.setState({
          dataSource :ResponseJson.result.data,
          stamp: ResponseJson.result.stamp,
          lastTid: ResponseJson.result.data[ResponseJson.result.data.length-1].tid,
          color: temp,
          additionTid: ResponseJson.result.addition_tid
        })
      })
  }
  getForum() {
    var time = new Date().getTime()
    var res = "_ssid=PHVua25vd24gc3NpZD4=&android_id=c515b866695fe8c3&client=861608045774351&clientId=40834464&crt="+time+"&en=buffer,nba,video,follow,cba,lrw,fitness,stylish,gear,digital&night=0&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = "https://bbs.mobileapi.hupu.com/1/7.3.2/forums/getForums?clientId=40834464&crt="+time+"&night=0&sign="+sign+"&client=861608045774351&en=buffer%2Cnba%2Cvideo%2Cfollow%2Ccba%2Clrw%2Cfitness%2Cstylish%2Cgear%2Cdigital&_ssid=PHVua25vd24gc3NpZD4%3D&time_zone=Asia%2FShanghai&android_id=c515b866695fe8c3"
    fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson)=>{
        console.log(url);
        this.setState({
          isLoading: false,
          forumData: ResponseJson.data
        })
      })
  }
  componentWillMount(){
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop,
    });
    gestureHandlers = {
      onStartShouldSetResponder: (e) => {
        return true
      },
      onMoveShouldSetResponder: (e) => {return true},
      onResponderGrant: (e) => {
        this.config.changeX = e.nativeEvent.pageX;
      },
      onResponderMove: (e) => {
        if(this.config.changeX > e.nativeEvent.pageX)
          this.setState({tab:1});
        else 
          this.setState({tab:0});
      },
    }
  }
  async componentDidMount() {
    this.getData();
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
          console.log(url);
          var temp = this.state.color;
          for(var i=0; i<ResponseJson.result.data.length; i++){
            if(ResponseJson.result.data[i].badge && ResponseJson.result.data[i].badge[0].name=='广告'){
              ResponseJson.result.data.splice(i, 1);
            }
            else {
              ResponseJson.result.data[i].forum_logo.replace("\\", "")
              temp.push('black')
            }
          }
          var result = this.state.dataSource.concat(ResponseJson.result.data)
          this.setState({
            dataSource :result,
            stamp: ResponseJson.result.stamp,
            lastTid: ResponseJson.result.data[i-1].tid,
            flag: true,
            color: temp
          })
      })
    }
} 
  refreshmore() {
    this.setState({
      lastTid: 0
    },()=>{
      this.getData()
    });
  }
  _scrollToTop = () => {
    if(!!this.flatListRef)
      this.flatListRef.scrollToOffset({ offset: 0, animated: true });
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
      <View {...gestureHandlers}>
        <View>
        {this.state.tab==0?
        <View style={{flexDirection: 'row', alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>this.setState({tab:0})}>
            <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:60, height: 22 ,margin: 12, alignItems: 'center'}}>
              <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22}}>关注</Text>
            </ImageBackground>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this.setState({tab:1})}>
            <Text style={{color:'rgba(0, 0, 0, 0.54)', textAlign: 'center', minWidth: 60}}>板块</Text>
          </TouchableWithoutFeedback>
        </View>
       :<View style={{flexDirection: 'row', alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>this.setState({tab:0})}>
            <Text style={{color:'rgba(0, 0, 0, 0.54)', textAlign: 'center', minWidth: 60, marginLeft: 10}}>关注</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this.setState({tab:1})}>
            <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:60, height: 22 ,margin: 12, alignItems: 'center'}}>
              <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight:22}}>板块</Text>
            </ImageBackground>
          </TouchableWithoutFeedback>
          </View>
        }
        </View>
        {this.state.tab==0?
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
        renderItem={({item,index}) =>
          <TouchableOpacity  style={styles.card} onPress={() => { 
            var temp = this.state.color;
            temp[index] = 'rgba(0, 0, 0, 0.38)';
            this.setState({color: temp});
            navigation.navigate('Details', { fid: item.fid, tid: item.tid, name: item.forum_name, logo: item.forum_logo})} 
          }>
            <View style={{ paddingBottom:5, flexDirection: 'row', paddingTop:5}}>
              <Image source={{uri: item.topic.logo||item.forum_logo}} style={{width: 25, height: 23, marginRight:5, borderRadius: 5}}/>
              <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12, height:25, lineHeight:25}}>{item.topic.topic_name||item.forum_name}</Text>
              <Text style={{color:'rgba(0, 0, 0, 0.38)', fontSize: 10, paddingLeft: 12, height:25, lineHeight:25}}>{item.userName}</Text>
            </View>
            <Text  style={{fontSize: 15, marginBottom: 5, color: this.state.color[index]}}>{item.title}</Text>
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
        :<View style={{borderTopColor: 'rgba(0, 0, 0, 0.06)', borderStyle:'solid', borderTopWidth: 0.5, flexDirection:'row'}}>
          <View style={{borderRightColor:'rgba(0, 0, 0, 0.06)', borderRightWidth:0.5, borderStyle: 'solid'}}>
            <FlatList 
            extraData={this.state}
            data={this.state.forumData}
            style={{width: Dimensions.get('window').width/4}}
            keyExtractor={(item, index) => 'key'+index}
            renderItem={({item,index}) =>
              <TouchableWithoutFeedback onPress={()=>{this.setState({plate: index})}}>
                <View>
                  {index==this.state.plate?
                  <View style={{borderLeftColor: '#C11C2D', borderStyle:'solid', borderLeftWidth:3, padding: 12, backgroundColor: '#F2F2F2'}}>
                    <Text style={{color:'#C11C2D'}}>{item.name}</Text>
                  </View>
                  :<View style={{ padding: 12}}>
                    <Text style={{color:'rgba(0, 0, 0, 0.54)'}}>{item.name}</Text>
                  </View>
                  }
                </View>
              </TouchableWithoutFeedback>
            }/>
          </View>
          <View style={{margin: 10, marginBottom:70}}>
            <FlatList 
            showsVerticalScrollIndicator = {false}
            extraData={this.state}
            data={this.state.forumData[this.state.plate].sub}
            keyExtractor={(item, index) => 'key'+index}
            style={{marginBottom: 20}}
            renderItem={({item,index}) =>
            <View>
              <View style={{borderBottomColor: 'rgba(0, 0, 0, 0.05)', borderBottomWidth:0.3, borderStyle:'solid', paddingBottom: 10, marginBottom:5}}>  
                <Text>{item.name}</Text>
              </View>
              <FlatList
              data={item.data}
              numColumns={3}
              columnWrapperStyle={{justifyContent: 'space-between', width:Dimensions.get("window").width-Dimensions.get("window").width/4-10}}
              keyExtractor={(item, index) => 'key'+index}
              renderItem={({item,index}) =>
              <TouchableWithoutFeedback onPress={()=>{navigation.navigate('Plate', {fid: item.fid, transparent: true})}}>
              <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{uri: item.logo}} style={{width: 38, height: 35}}/>
                <Text style={{fontSize: 10, minWidth:70, textAlign:'center'}} numberOfLines ={5}>{item.name.slice(0,7)}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/images/post.png')} style={{width: 10, height: 10}}/>
                  <Text style={{fontSize: 8, color: 'rgba(0, 0, 0, 0.54)', textAlign: 'center'}}>{item.count}</Text>
                </View>
              </View>
              </TouchableWithoutFeedback>
              }/>
            </View>
            }/>
          </View>
        </View>
        }
      </View>
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



