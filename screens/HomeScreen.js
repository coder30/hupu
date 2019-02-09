import React from 'react';
import { Font } from 'expo';
import  MD5  from 'react-native-md5';
import { logo, name } from '../constants/Team';
import LogoTitle from '../components/LogoTitle';
import {Text, View, FlatList, Image, TouchableOpacity, ImageBackground, StyleSheet,ActivityIndicator,RefreshControl ,Dimensions, ScrollView} from 'react-native';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };

  constructor(props){
    super(props);
    this.state = {isLoading: true, nid: 0, count: 0, flag: true};
  }
  getData() {
    var time = new Date().getTime()
    var res = "channel=hupucom&client=861608045774351&crt="+time+"&entrance=-1&night=0&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getNews?crt="+time+"&night=0&channel=hupucom&sign="+sign+"&client=861608045774351&time_zone=Asia/Shanghai&entrance=-1"
    return fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson)=>{
        var topic = []
        for(var i=0; i<ResponseJson.result.data.length; i++){
          if(ResponseJson.result.data[i].badge){
            ResponseJson.result.data[i].img = ResponseJson.result.data[i].img.slice(0,ResponseJson.result.data[i].img.indexOf('?'))
            topic.push(ResponseJson.result.data[i])
          }
          else 
            break;
        }
        var news = ResponseJson.result.data.slice(i);
        if(ResponseJson.result.game.game_lists.length%2){
          ResponseJson.result.game.game_lists.pop();
        }
        var num = this.state+ news.length
        this.setState({
          isLoading: false,
          topSource :topic,
          newSource: news,
          gameSource: ResponseJson.result.game.game_lists,
          nid: news[news.length-1].nid,
          count: num
        })
      })
  }
  componentDidMount() {
    Font.loadAsync({
      'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
    });
    this.getData()
  }

  onEndReached = () => { 
    var time = new Date().getTime();
    var res = "channel=hupucom&client=861608045774351&crt="+time+"&direc=next&entrance=-1&nid="+this.state.nid+"&night=0&pre_count=21&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
    var sign = MD5.hex_md5(res);
    var url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getNews?crt="+time+"&night=0&channel=hupucom&nid="+this.state.nid+"&sign="+sign+"&client=861608045774351&direc=next&time_zone=Asia%2FShanghai&entrance=-1&pre_count=21"
    return fetch(url)
      .then((Response)=>Response.json())
      .then((ResponseJson)=>{
        console.log(url);
        var result = this.state.newSource.concat(ResponseJson.result.data)
        this.setState({
          newSource: result,
          nid: ResponseJson.result.data[ResponseJson.result.data.length-1].nid
        })
      })
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    })
    this.getData();
    this.setState({
      isRefreshing: false
    })
  }
  _contentViewScroll(e){
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    if (offsetY + oriageScrollHeight >= contentSizeHeight-500){
      if(this.state.flag){
        this.setState({
          flag: false
        })
        var time = new Date().getTime();
        var res = "channel=hupucom&client=861608045774351&crt="+time+"&direc=next&entrance=-1&nid="+this.state.nid+"&night=0&pre_count=21&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        var url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getNews?crt="+time+"&night=0&channel=hupucom&nid="+this.state.nid+"&sign="+sign+"&client=861608045774351&direc=next&time_zone=Asia%2FShanghai&entrance=-1&pre_count=21"
        return fetch(url)
          .then((Response)=>Response.json())
          .then((ResponseJson)=>{
            console.log(url);
            var result = this.state.newSource.concat(ResponseJson.result.data)
            this.setState({
              newSource: result,
              nid: ResponseJson.result.data[ResponseJson.result.data.length-1].nid,
              flag: true
            })
          })
      }
    }
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
      <ScrollView
        iosscrollsToTop={true}
        showsVerticalScrollIndicator = {false}
        onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
        refreshControl={
        <RefreshControl
          colors={['#C01E2F']}
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
        }>
        <FlatList
          data={this.state.topSource}
          style={{margin:12, marginRight: 0}}
          keyExtractor={item => item.title} 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) =>
            <View>
              <TouchableOpacity onPress={() =>  {item.badge.length==2?navigation.navigate('Topic', { nid: item.nid}): navigation.navigate('News', {  replies: item.replies, nid: item.nid})}}>
                <ImageBackground  source={{uri: item.img}} style={{width: Dimensions.get("screen").width-40, height: (Dimensions.get("screen").width-40)*190/328, margin:4, justifyContent: 'space-between'}}>
                  {item.badge[1]?
                  <Image source={require('../assets/images/topic.png')} style={{width: 57, height: 22, margin:10}}/>
                  :<View></View>
                  }
                  
                  <View style={{padding:10, backgroundColor:'rgba(0, 0, 0, 0.54)'}}>
                    <Text style={{color:'#FFFFFF'}}>{item.title}</Text>
                    <View style={{flexDirection:'row', alignContent: 'center', marginTop: 10, color:'rgba(0, 0, 0, 0.38)'}}>
                      <Image source={require('../assets/images/comment.png')} style={{width: 9, height: 10, marginRight:3, tintColor :'#FFFFFF'}}/>
                      <Text style={{marginRight: 10, color:'#FFFFFF', fontSize: 10 ,height:10, lineHeight:10}}>{item.replies}</Text>
                      <Image source={require('../assets/images/light.png')} style={{width: 8, height: 10, marginRight:3, tintColor :'#FFFFFF'}}/>
                      <Text style={{marginRight: 10, color:'#FFFFFF', fontSize: 10,height:10, lineHeight:10}}>{item.lights}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          }/>
          <Image source={require('../assets/images/gameLabel.png')}  style={{width: 72, height: 24, marginLeft:16}}/>
          <FlatList 
            data={this.state.gameSource}
            keyExtractor={item => item.gid} 
            style={{margin:9}}
            numColumns={2}
            renderItem={({item}) =>
            <View style={styles.gameCard}>
              <View style={{flexDirection: 'column', marginLeft:-5}}>
                <Image source={logo[item.home_tid]} style={{width:50, height:50}}/>
                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:35, textAlign:'center', marginTop:-5, marginBottom:8}}>{name[item.home_tid]}</Text>
              </View>
              <View style={{margin:-20, flexDirection:"column", alignItems:"center"}}>
                <View style={{flexDirection:'row'}}>
                  {item.home_score>item.away_score?
                  <Text style={{fontFamily: 'DINCond-Bold', fontSize: 21, color: '#C01E2F',marginBottom:10, marginTop:10,textAlign:'center',minWidth:40}}>{item.home_score}</Text>
                  :<Text style={{fontFamily: 'DINCond-Bold', fontSize: 21, color: 'rgba(0, 0, 0, 0.54)',marginBottom:10, marginTop:10,textAlign:'center',minWidth:40}}>{item.home_score}</Text>
                  }
                  <Text style={{fontFamily: 'DINCond-Bold', fontSize: 21, color: 'rgba(0, 0, 0, 0.54)',marginBottom:10, marginTop:10, marginLeft: -5, marginRight:-5,textAlign:'center'}}>-</Text>
                  {item.home_score<item.away_score?
                  <Text style={{fontFamily: 'DINCond-Bold', fontSize: 21, color: '#C01E2F',marginBottom:10, marginTop:10,textAlign:'center',minWidth:40}}>{item.away_score}</Text>
                  :<Text style={{fontFamily: 'DINCond-Bold', fontSize: 21, color: 'rgba(0, 0, 0, 0.54)',marginBottom:10, marginTop:10,textAlign:'center',minWidth:40}}>{item.away_score}</Text>
                  }
                </View>
                {item.status=="1"?
                  <ImageBackground source={require('../assets/images/greyRectangle.png')} style={{width:60, height:16, marginBottom: 5}}>
                  <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 17, height:16, fontWeight: '500'}}>集锦</Text>
                  </ImageBackground>:
                  <ImageBackground source={require('../assets/images/timeCard.png')} style={{width:85, height:16, marginBottom: 5}}>
                    <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 16, height:16}}>{item.process}</Text>
                  </ImageBackground>
                }
              </View>
              <View style={{flexDirection: 'column'}}>
                <Image source={logo[item.away_tid]} style={{width:50, height:50}}/>
                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:35, textAlign:'center', marginTop:-5, marginBottom:8}}>{name[item.away_tid]}</Text>
              </View>
            </View>
          }/>
          <View style={{marginLeft:16, marginRight: 10}}>
            <Image source={require('../assets/images/news.png')}  style={{width: 72, height: 24, marginBottom:7}}/>
            <FlatList 
              data={this.state.newSource}
              keyExtractor={item => item.nid}
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
            <ActivityIndicator color ="#C01E2F"/>
          </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  gameCard:{
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#F2F2F2',
    height: 88,
    flex: 1,
    marginLeft: 7,
    marginRight: 7,
    margin: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})