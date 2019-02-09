import React from 'react';
import { Font } from 'expo';
import { logo, name } from '../constants/Team';
import LogoTitle from '../components/LogoTitle';
import { View, StyleSheet,ActivityIndicator, Text, FlatList, Image} from 'react-native';


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };

  constructor(props){
    super(props);
    this.state = {isLoading: true, index: 0}
  }

  componentDidMount() {
    Font.loadAsync({
      'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
    });
    return fetch('https://games.mobileapi.hupu.com/1/7.3.2/nba/getMatchs?crt=1548734093560&night=0&channel=miui&sign=32cd5aaf9265ab0333397d618529f7a7&client=316810195181635&_ssid=IkExMzAzLTVHIg%3D%3D&time_zone=Asia%2FShanghai&android_id=36f92b5c1454e1e9')
      .then((Response)=>Response.json())
      .then((ResponseJson) => {
        var res = ResponseJson.result.games;
        var index = 0;
        for(var i=0; i<res.length; i++){
          if(res[i].date_block[0] == '今'){
            index = i;
          }
          for(var j=0; j<res[i].data.length; j++){
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
      <View style={styles.container}>
        <FlatList
          keyExtractor={item => item.day} 
          initialScrollIndex={this.state.index}
          data={this.state.dataSource} 
          showsVerticalScrollIndicator = {false}
          renderItem={({item}) =>
          <View>
            <Text style={styles.gameDate}>{item.date_block}</Text>
            <FlatList
              data={item.data}
              keyExtractor={item => item.url}
              renderItem={({item}) =>
                <View>
                  {item.home.name=="数据乱斗" ? null :
                    <View style={styles.gameCard}>
                      <Image source={logo[item.home.id]} style={{width: 54, height: 54, marginRight:3, marginLeft: -20}}/>
                      <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:35}}>{name[item.home.id]}</Text>
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
                      <Text style={{fontFamily: 'DINCond-Bold', fontSize: 18, color: 'rgba(0, 0, 0, 0.38)',minWidth:35}}>{name[item.away.id]}</Text>
                      <Image source={logo[item.away.id]} style={{width: 54, height: 54, marginRight:3 ,marginRight: -20}}/> 
                    </View>
                  }
                </View>
              }
            />
          </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
    justifyContent: 'space-between',
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
