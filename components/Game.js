import React from 'react';
import { Font } from 'expo';
import { logo, name } from '../constants/Team';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableWithoutFeedback} from 'react-native';

export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {isLoading: true, index: 0}
    }
    componentDidMount() {
        Font.loadAsync({
          'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
        });
        return fetch('https://games.mobileapi.hupu.com/1/7.3.2/nba/getMatchs?crt=1548734093560&night=0&channel=miui&sign=32cd5aaf9265ab0333397d618529f7a7&client=316810195181635&_ssid=IkExMzAzLTVHIg==&time_zone=Asia/Shanghai&android_id=36f92b5c1454e1e9')
          .then((Response)=>Response.json())
          .then((ResponseJson) => {
            var res = ResponseJson.result.games;
            var index = 0;
            for(var i=0; i<res.length; i++){
              if(res[i].date_block[0] == '今'){
                index = i;
              }
              for(var j=0; j<res[i].data.length; j++){
                if(res[i].data[j].style=='match'){
                  if(res[i].data[j].status.id==3){
                    res[i].data[j].home_score = '';
                    res[i].data[j].away_score = '';
                  }
                  if(Number(res[i].data[j].home_score) > Number(res[i].data[j].away_score)){
                    res[i].data[j].home_color = '#C01E2F'
                    res[i].data[j].away_color = 'rgba(0, 0, 0, 0.54)'
                  }
                  else {
                    res[i].data[j].home_color = 'rgba(0, 0, 0, 0.54)'
                    res[i].data[j].away_color = '#C01E2F'
                  }
                }
                else {
                  res[i].data.splice(j, 1);
                }
              }
            }
            this.setState({
              isLoading: false,
              dataSource :ResponseJson.result.games,
              index: index
            })
          })
          .catch((error)=>{
            console.log(error);
          })
      }
    render() {
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator color ="#C01E2F"/>
              </View>
            )
        }
        return (
            <FlatList
                keyExtractor={(item, index) => 'key'+index}
                ref={el => this.list = el}
                extraData={this.state}
                data={this.state.dataSource} 
                showsVerticalScrollIndicator = {false}
                initialNumToRender={10}
                renderItem={({item}) =>
                <View>
                    <Text style={styles.gameDate}>{item.date_block}</Text>
                    <FlatList
                        data={item.data}
                        keyExtractor={(item, index) => 'key'+index}
                        getItemLayout={(data, index) => (
                          // 120 是被渲染 item 的高度 ITEM_HEIGHT。
                          {length: 120, offset: 120 * index, index}
                        )}
                        renderItem={({item}) =>
                        <View>
                            {item.home.name=="数据乱斗" ? null :
                            <TouchableWithoutFeedback onPress={()=>{
                              if(item.status.id==1)
                                this.props.navigate('GameDetail', {
                                  home_id: item.home.id, 
                                  away_id: item.away.id,
                                  home_score: item.home_score,
                                  away_score: item.away_score,
                                  gid: item.gid
                                })}
                            }>
                              <View style={styles.gameCard}>
                                  {name[item.home.id]?
                                  <Image source={logo[item.home.id] } style={{width: 54, height: 54}}/>
                                  :<Image source={{uri: item.home.logo}} style={{width: 34, height: 34}}/>
                                  } 
                                  {name[item.home.id]?
                                  <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:45}}>{name[item.home.id]}</Text>
                                  :<Text style={{fontFamily: 'DINCond-Bold', fontSize: 12, color: 'rgba(0, 0, 0, 0.38)',minWidth:45}}>{item.home.name}</Text>
                                  }      
                                  <View style={{flexDirection: 'row', alignItems: 'center', flex:2, justifyContent: 'space-between', maxWidth: 200, minWidth: 150}}>
                                  {item.home_score!=''?
                                  <Text style={{padding:5, fontFamily: 'DINCond-Bold', fontSize: 24, color: item.home_color, minWidth:40, marginLeft: -10}}>{item.home_score}</Text>
                                  :<View style={{marginRight: 16}}></View>
                                  }
                                  <View >
                                  {item.status.id==2
                                      ?<Text style={{color: "#C01E2F" ,textAlign:'center', fontWeight: 'bold', fontSize: 15.5}}>LIVE</Text>
                                      :null
                                  }
                                  {item.status.id==3
                                      ?<View style={{flexDirection: 'row', height: 18, marginBottom: 2}}>
                                      <Text style={styles.live}>LIVE</Text>
                                      <Text style={styles.gameTime}>{item.status.txt.slice(0,item.status.txt.indexOf('开'))}</Text>
                                      </View>
                                      :null
                                  }
                                  <Text style={{color: 'rgba(0, 0, 0, 0.38)' ,textAlign:'center', fontSize: 12.5, marginBottom:3}}>{item.title}</Text>
                                  {item.status.id==2
                                      ?<View style={{flexDirection: 'row', height: 18, marginBottom: 15, justifyContent: 'center'}}>
                                      <Text style={styles.part}>{item.status.txt.slice(0,item.status.txt.indexOf(' '))}</Text>
                                      <Text style={styles.gameTime}>{item.status.txt.slice(item.status.txt.indexOf(' '))}</Text>
                                      </View>
                                      :null
                                  }
                                  {item.status.id==1
                                      ?<Text style={{textAlign:'center', fontSize: 12, color: 'rgba(0, 0, 0, 0.38)'}}>结束</Text>
                                      :null
                                  }
                                  </View>
                                  {item.away_score!="" ?
                                  <Text style={{padding:5, fontFamily: 'DINCond-Bold', fontSize: 24, color:item.away_color, minWidth:40}}>{item.away_score}</Text>
                                  :<View style={{marginLeft: 16}}></View>
                                  }
                                  </View>
                                  {name[item.away.id]?
                                  <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:45, textAlign: 'right'}}>{name[item.away.id]}</Text>
                                  :<Text style={{fontFamily: 'DINCond-Bold', fontSize: 12, color: 'rgba(0, 0, 0, 0.38)',minWidth:45, textAlign: 'center'}}>{item.away.name}</Text>
                                  } 
                                  {name[item.away.id]?
                                  <Image source={logo[item.away.id] }  style={{width: 54, height: 54}}/>
                                  :<Image source={{uri: item.away.logo}}  style={{width: 34, height: 34}}/>
                                  }                                      
                              </View>
                            </TouchableWithoutFeedback>
                            }
                        </View>
                    }/>
                </View>
            }/>
        );
    }
}

const styles = StyleSheet.create({
    gameDate: {
      backgroundColor: '#F2F2F2',
      padding: 10,
    },
    gameCard: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#F2F2F2',
      height: 88,
      flex: 1, 
      flexDirection: 'row',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      margin: 10,
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    live: {
      backgroundColor: '#C01E2F',
      height:18,
      lineHeight:18,
      textAlign: "center",
      color: "#FFFFFF",
      fontSize:14,
      alignItems: 'center',
      paddingLeft: 5  ,
      paddingRight: 5,
    },
    part: {
      backgroundColor: '#C01E2F',
      height:18,
      lineHeight:18,
      textAlign: "center",
      color: "#FFFFFF",
      fontSize:12,
      alignItems: 'center',
      paddingLeft: 5  ,
      paddingRight: 5,
    },
    gameTime: {
      backgroundColor: '#F2F2F2',
      height:18,
      lineHeight:18,
      textAlign: "center",
      color: "#C01E2F",
      alignItems: 'center',
      paddingLeft: 5,
      paddingRight: 5,
      fontSize:13,
    }
  });
  