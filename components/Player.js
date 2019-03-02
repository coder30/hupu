import React from 'react';
import { Font } from 'expo';
import {View, FlatList, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Dimensions, TouchableWithoutFeedback} from 'react-native'

const color=['#fff', '#F2F2F2']
export default class Player extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: true, tab:0};
  }
  componentDidMount() {
    Font.loadAsync({
      'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
    });
    if(this.props.type=='regular'){
        var url = "http://games.mobileapi.hupu.com/1/7.3.2/nba/getPlayerStats?offline=json&rank_type=1&client=861608045774351&webp=1";
        return fetch(url)
                .then((Response)=> Response.json())
                .then((ResponseJson)=>{
                    this.setState({
                        isLoading: false,
                        dataSource: ResponseJson.result
                    })
                })
    }
    else {
        var url = "http://games.mobileapi.hupu.com/1/7.3.2/nba/getPlayerDataInGeneral?offline=json&type="+ this.props.type +"&client=861608045774351&webp=1";
        return fetch(url)
                .then((Response)=> Response.json())
                .then((ResponseJson)=>{
                    this.setState({
                        isLoading: false,
                        dataSource: ResponseJson.data
                    })
                })
    }
  }
  scrollToIndex = (i) => {
    this.flatListRef.scrollToIndex({animated: true, index: i});
  }
  _contentViewScroll(e){
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    var i = Math.floor(offsetY/290);
    this.setState({
        tab: i
    })
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
          data={this.state.dataSource}
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
          }
          />
        </View>
        <View>
          <FlatList
          data={this.state.dataSource}
          style={{width:Dimensions.get("screen").width-Dimensions.get("screen").width/4.2}}
          ref={(ref) => { this.flatListRef = ref; }}
          onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
          keyExtractor={(item, index) => 'key'+index}
          showsVerticalScrollIndicator = {false}
          renderItem={({item, index}) =>
              <View>
                  <View style={{flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.12)', padding: 7, justifyContent: 'space-between'}}>
                      <Text style={{fontSize: 12}}>{item.name}</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12}}>球队</Text>
                        <Text style={{marginLeft: 20,marginRight: 5, fontSize: 12}}>数据</Text>
                      </View>
                  </View>
                  <FlatList
                  data={item.data}
                  showsVerticalScrollIndicator = {false}
                  keyExtractor={(item, index) => 'key'+index}
                  renderItem={({item,index}) =>
                    <View style={{flexDirection: 'row', padding:5, backgroundColor: color[index%2], justifyContent: 'space-between'}}>
                      <View style={{flexDirection: 'row', width: 160}}>
                        <Text style={{lineHeight:30,fontFamily: 'DINCond-Bold',color:'rgba(0, 0, 0, 0.54)', minWidth: 12}}>{index+1}</Text>
                        <Image source={{uri: item.player_header}} style={{width: 28, height: 40, marginRight:3}}/>
                        <View>
                            <Text style={{}}>{item.player_name}</Text>
                            <Text style={{fontSize: 12, lineHeight:15, color:"rgba(0, 0, 0, 0.54)"}}>{item.pts}分{item.reb}板{item.asts}助</Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{lineHeight:30, marginRight: 20, minWidth: 30}}>{item.team_name}</Text>
                        <Text style={{lineHeight:30, paddingRight: 5, minWidth: 30}}>{item.val}</Text>
                      </View>
                    </View>
                  }
                  />
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
    width: Dimensions.get("screen").width/4.2
  },
})
