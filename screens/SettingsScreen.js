import React from 'react';
import  MD5  from "react-native-md5";
import { View, FlatList ,ActivityIndicator, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import LogoTitle from '../components/LogoTitle'

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };
  constructor(props){
    super(props);
    this.state = {isLoading: true, stamp: 0, lastTid: 0, flag: true};
    this.onEndReachedCalledDuringMomentum = true; 
  }
  getData() {
    var time = new Date().getTime()
    var res = "client=316810195181635&crt=" + time + "&isHome=1&lastTid="+this.state.lastTid+"&night=0&stamp="+this.state.stamp+"&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = 'https://bbs.mobileapi.hupu.com/1/7.1.1/recommend/getThreadsList?crt=' + time +'&night=0&lastTid='+this.state.lastTid+'&sign='+ sign +'&client=316810195181635&stamp='+this.state.stamp+'&isHome=1&time_zone=Asia/Shanghai'
    return fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson) => {
        for(var i=0; i<ResponseJson.result.data.length; i++){
          ResponseJson.result.data[i].forum_logo.replace("\\", "")
          if(ResponseJson.result.data[i].badge){
            ResponseJson.result.data.splice(i, 1);
          }
        }
        this.setState({
          isLoading: false,
          dataSource :ResponseJson.result.data,
          stamp: time,
          lastTid: ResponseJson.result.data[i-1].tid
        })
      })
  }
  async componentDidMount() {
    this.getData();
  }
  onEndReached = () => { 
    if(this.state.flag){
      this.setState({
        flag: false
      })
      var time = new Date().getTime()
      var res = "client=316810195181635&crt=" + time + "&isHome=0&lastTid="+this.state.lastTid+"&night=0&stamp="+this.state.stamp+"&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
      var sign = MD5.hex_md5(res);
      var url = 'https://bbs.mobileapi.hupu.com/1/7.1.1/recommend/getThreadsList?crt=' + time +'&night=0&lastTid='+this.state.lastTid+'&sign='+ sign +'&client=316810195181635&stamp='+this.state.stamp+'&isHome=0&time_zone=Asia/Shanghai'
      return fetch(url)
        .then((Response)=>Response.json())
        .then((ResponseJson) => {
           for(var i=0; i<ResponseJson.result.data.length; i++){
            ResponseJson.result.data[i].forum_logo.replace("\\", "")
          }
          var result = this.state.dataSource.concat(ResponseJson.result.data)
          this.setState({
            isLoading: false,
            dataSource :result,
            stamp: time,
            lastTid: ResponseJson.result.data[i-1].tid,
            flag: true
          })
      })
    }
} 
  refreshmore() {
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
    return (
      <View>
        <FlatList 
          data={this.state.dataSource} 
          showsVerticalScrollIndicator = {false}
          keyExtractor={item => item.title} 
          colors={['#C01E2F']}
          onRefresh={this.refreshmore.bind(this)}
          refreshing={this.state.isLoading}
          onEndReachedThreshold={0.9} 
          onEndReached={this.onEndReached.bind(this)} 
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }} 
          renderItem={({item}) =>
          <TouchableOpacity  style={styles.card} onPress={() => {navigation.navigate('Details', { fid: item.fid, tid: item.tid, name: item.forum_name, logo: item.forum_logo})} }>
            <View style={{paddingBottom: 10, flexDirection: 'row', paddingTop:10}}>
              <Image source={{uri: item.forum_logo}} style={{width: 28, height: 25, marginRight:5}}/>
              <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 14, height:25, lineHeight:25}}>{item.forum_name}</Text>
              <Text style={{color:'rgba(0, 0, 0, 0.38)', fontSize: 14, paddingLeft: 12, height:25, lineHeight:25}}>{item.userName}</Text>
            </View>
            <Text  style={{fontSize: 18, marginBottom: 5, color: item.color}}>{item.title}</Text>
            <View style={{flexDirection:'row', alignContent: 'center', marginTop: 10, color:'rgba(0, 0, 0, 0.38)'}}>
              <Image source={require('../assets/images/comment.png')} style={{width: 13, height: 13, marginRight:6, opacity:0.38}}/>
              <Text style={{marginRight: 20, color:'rgba(0, 0, 0, 0.38)', height:15, lineHeight: 15}}>{item.replies}</Text>
              <Image source={require('../assets/images/light.png')} style={{width: 12, height: 15, marginRight:6, opacity:0.38}}/>
              <Text style={{marginRight: 10, color:'rgba(0, 0, 0, 0.38)', height:15, lineHeight: 15}}>{item.lightReply}</Text>
            </View>
          </TouchableOpacity >
          }
        />
      </View>
    );
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



