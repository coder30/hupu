import React from 'react';
import  MD5  from "react-native-md5";
import { View, FlatList ,ActivityIndicator, Text, Image, TouchableWithoutFeedback, Dimensions} from 'react-native';
export default class Plate extends React.Component {
    constructor(props){
        super(props);
        this.state = {isLoading: true, plate: 0};
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
              forumData: ResponseJson.data,
            })
          })
    }
    componentWillMount() {
        this.getForum();
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
          <View style={{borderTopColor: 'rgba(0, 0, 0, 0.06)', borderStyle:'solid', borderTopWidth: 0.5, flexDirection:'row'}}>
              <View style={{borderRightColor:'rgba(0, 0, 0, 0.06)', borderRightWidth:0.5, borderStyle: 'solid'}}>
                <FlatList 
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
        );
    }
}