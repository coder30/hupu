import React from 'react';
import { Font } from 'expo';
import { logo } from '../constants/Team';
import {View, FlatList, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Dimensions, TouchableWithoutFeedback} from 'react-native'

const color=['#fff', '#F2F2F2']
export default class Team extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: true, tab:0};
  }
  componentDidMount() {
    Font.loadAsync({
      'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
    });
    var url = "http://games.mobileapi.hupu.com/1/7.1.1/data/nba?offline=json&client=861608045774351&webp=1";
    return fetch(url)
            .then((Response)=> Response.json())
            .then((ResponseJson)=>{
              this.setState({
                isLoading: false,
                dataSource: ResponseJson.data
              })
            })
  }
  scrollToIndex = (i) => {
    this.flatListRef.scrollToIndex({animated: true, index: i});
  }
  _contentViewScroll(e){
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    //console.log(offsetY,contentSizeHeight, oriageScrollHeight);
    if(offsetY<630){
      this.setState({
        tab: 0
      })
    }
    else if(offsetY<1260){
      this.setState({
        tab: 1
      })
    }
    else {
      var i = Math.floor((offsetY-1260)/250+2);
      this.setState({
        tab: i
      })
      if(offsetY>3700 &&offsetY<4000 )
        this.flatListRefLeft.scrollToIndex({animated: true, index: i});
      else if(offsetY>6500 &&offsetY<6700)
        this.flatListRefLeft.scrollToIndex({animated: true, index: i});
      else if(offsetY>9000 &&offsetY<9500)
      this.flatListRefLeft.scrollToIndex({animated: true, index: i});
    }
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={{padding: 20}}>
          <ActivityIndicator color ="#C01E2F"/>
        </View>
      )
    }
    return (
      <View style={{flexDirection:'row'}}>
        <View>
          <FlatList
          style={styles.leftTab}
          data={this.state.dataSource.data}
          keyExtractor={(item, index) => 'key'+index}
          extraData={this.state}
          showsVerticalScrollIndicator = {false}
          ref={(ref) => { this.flatListRefLeft = ref; }}
          renderItem={({item, index}) =>
          <TouchableWithoutFeedback onPress={() => {
            this.scrollToIndex(index);
            this.setState({
              tab: index
            })
            }}>
            {index==this.state.tab?
            <View style={{backgroundColor: '#F2F2F2',padding: 15, borderLeftColor:'#C11C2D', borderLeftWidth: 3,borderStyle:'solid'}}>
              <Text style={{color: '#C11C2D'}}>{item.name}</Text>
            </View>
            :<View style={{padding: 15}}>
              <Text style={{color: 'rgba(0, 0, 0, 0.54)'}}>{item.name}</Text>
            </View>
            }
          </TouchableWithoutFeedback>
          }/>
        </View>
        <View>
          <FlatList
          data={this.state.dataSource.data}
          ref={(ref) => { this.flatListRef = ref; }}
          onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
          keyExtractor={(item, index) => 'key'+index}
          showsVerticalScrollIndicator = {false}
          renderItem={({item, index}) =>
            <View>
              {index==0||index==1?
              <View style={{flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.12)', padding: 7}}>
                <Text style={{paddingRight: 60, fontSize: 12}}>{item.name}</Text>
                <Text style={{paddingRight: 15, fontSize: 12}}>胜-负</Text>
                <Text style={{paddingRight: 17, fontSize: 12}}>胜率/胜场差</Text>
                <Text style={{fontSize: 12}}>近况</Text>
              </View>
              :<View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.12)', padding: 7}}>
                <Text style={{fontSize:12}}>{item.name}</Text>
                <Text style={{fontSize:12, paddingRight: 15}}>数据</Text>
              </View>
              }
              <FlatList
              data={item.data}
              showsVerticalScrollIndicator = {false}
              keyExtractor={(item, index) => 'key'+index}
              initialNumToRender={15}
              renderItem={({item,index}) =>
                <View style={{flexDirection: 'row', padding:5, backgroundColor: color[index%2], width:Dimensions.get("window").width-Dimensions.get("window").width/4}}>
                {item.strk?
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', minWidth:110}}>
                      <Text style={{lineHeight:30,fontFamily: 'DINCond-Bold',color:'rgba(0, 0, 0, 0.54)', minWidth: 12}}>{index+1}</Text>
                      <Image source={logo[item.tid]} style={{width: 34, height: 30, marginRight:3}}/>
                      <Text style={{lineHeight:30,flex:2, paddingRight: 10, minWidth: 70, fontSize: 12}}>{item.name}</Text>
                    </View>
                    <Text style={{lineHeight:30, fontSize: 12, minWidth: 37}}>{item.win}-{item.lost}</Text>
                    <Text style={{lineHeight:30, paddingLeft: 10, minWidth: 85, fontSize: 12}}>{item.gb}</Text>
                    <Text style={{lineHeight:30, fontSize: 12, paddingRight: 5}}>{item.strk}</Text>
                  </View>
                  :<View style={{flexDirection: 'row', justifyContent: 'space-between', flex:1}}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{lineHeight:34,fontFamily: 'DINCond-Bold',color:'rgba(0, 0, 0, 0.54)', minWidth: 12}}>{item.rank}</Text>
                      <Image source={logo[item.team_id]} style={{width: 34, height: 34, marginRight:3}}/>
                      <Text style={{marginRight:3, lineHeight:34, fontSize: 12}}>{item.team_alias}</Text>
                    </View>
                    <Text style={{lineHeight:34, fontSize: 12, paddingRight: 10}}>{item.value}</Text>
                  </View>
                }
                </View>
              }/>
            </View>
          }/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  leftTab: {
    borderRightColor: '#F2F2F2',
    borderStyle: 'solid',
    borderRightWidth: 1,
    width: Dimensions.get("window").width/4
  },
})
