import React from 'react';
import { Font } from 'expo';
import  MD5  from 'react-native-md5';
var DomParser = require('dom-parser');
import HTML from 'react-native-render-html';
import { logo, chineseName, color, chineseShortName, teamVertical, teamVerticalChinese } from '../constants/Team';
import { WebView,Modal, View, StyleSheet, Text, Image, ActivityIndicator,Dimensions,StatusBar,Platform,ImageBackground,ScrollView, FlatList, TouchableWithoutFeedback, Linking} from 'react-native';
var tabColor = ['#fff', '#C01E2F', '#fff'];
const dataColor=['#F2F2F2', '#fff'];
var gid = '';
export default class GameDetailScreen extends React.Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: '#fff'
    };
    constructor(props){
        super(props);
        this.state = {isLoading: true, tab1: 3, tab2: 0, position: 'absolute', tab3:0,tab4:1,tab5:1,modalVisible:false}
    }
    componentDidMount(){
        StatusBar.setBarStyle('light-content');
        const { navigation } = this.props;
        Font.loadAsync({
            'DINCond-Bold': require('../assets/fonts/DINCond-Bold.otf'),
        });
        gid = navigation.getParam('gid')
        var url = 'https://games.mobileapi.hupu.com/1/7.1.1/nba/getRecap7?client=861608045774351&gid='+ gid +'&nopic=0&night=0&entrance=-1&night=0'
        fetch(url)
        .then((Response)=>{
            let start = Response._bodyInit.indexOf('<body');
            let end = Response._bodyInit.indexOf('</body>');
            let html = Response._bodyInit.slice(start, end);
            html =  html + '</body>'
            let parser = new DomParser();
            let dom = parser.parseFromString(html);
            let imgUrl = 'http:'+dom.getElementsByTagName('img')[0].attributes[0].value;
            let width = Dimensions.get("window").width;
            start = imgUrl.indexOf('w/')+6;
            end = imgUrl.indexOf('/h', start);
            let w = imgUrl.slice(start, end);
            start = imgUrl.indexOf('h/')+2;
            let h = imgUrl.slice(start);
            let height =Math.floor(h * w / width);
            let img = {imgUrl, width, height}
            let list = dom.getElementsByClassName('section-item player')[0].getElementsByTagName('li');
            let players = []
            for(let i=0; i<list.length; i++){
                let player = {};
                player.url = dom.getElementsByTagName('img')[i+1].attributes[0].value;;
                player.name = list[i].getElementsByTagName('span')[1].innerHTML;
                player.pts = list[i].getElementsByClassName('value')[0].innerHTML;
                player.reb = list[i].getElementsByClassName('value')[1].innerHTML;
                player.ast = list[i].getElementsByClassName('value')[2].innerHTML;
                player.ste = list[i].getElementsByClassName('value')[3].innerHTML;
                player.blk = list[i].getElementsByClassName('value')[4].innerHTML;
                players.push(player)
            }
            let collection = dom.getElementsByClassName('section-item hot-pic')[0].getElementsByTagName('a')[0].attributes[0].value.slice(10);
            let arr = dom.getElementById('J-main').getElementsByTagName('p');
            let title = arr[0].getElementsByTagName('strong')[0].innerHTML;
            let article = [];
            for(let i=1; i<arr.length; i++){
                article.push(arr[i].innerHTML);
            }
            let data = {img, players, collection, title, article}
            this.setState({
                isLoading: false,
               dataSource: data
            })
        })
        var time = new Date().getTime();
        var res = "channel=hupucom&client=861608045774351&crt="+time+"&entrance=-1&gid="+gid+"&night=0&time_zone=Asia/Shanghai&vertical=trueHUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getBoxscore?gid="+gid+"&crt="+time+"&night=0&channel=hupucom&sign="+sign+"&client=861608045774351&vertical=true&time_zone=Asia%2FShanghai&entrance=-1"
        fetch(url)
            .then((Response)=>Response.json())
            .then((ResponseJson)=>{
                console.log(url);
                this.setState({
                    dataDetail: ResponseJson.result
                })
            })
    }
    render() {
        const { navigation } = this.props;
        const home_id = navigation.getParam('home_id');
        const away_id = navigation.getParam('away_id');
        const home_score = navigation.getParam('home_score');
        const away_score = navigation.getParam('away_score');
        let home_color = ''
        let away_color = '';
        if(Number(home_score) > Number(away_score)){
            home_color = '#C01E2F'
            away_color = 'rgba(0, 0, 0, 0.54)'
        }
        else {
            home_color = 'rgba(0, 0, 0, 0.54)'
            away_color = '#C01E2F'
        }
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator color ="#C01E2F"/>
              </View>
            )
        }
        return(
            <View>
                <Modal
                visible={this.state.modalVisible}
                transparent={true}
                onRequestClose={() => this.setState({ modalVisible: false })}
                >
                    <TouchableWithoutFeedback onPress={()=>{
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height/5}}></View>
                    </TouchableWithoutFeedback>
                    <WebView source={{uri:"https://games.mobileapi.hupu.com/1/7.3.2/nba/showPlayer?client=861608045774351&night=0&gid="+gid+"&player_id="+this.state.player_id}} style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height}}/>
                </Modal>
                <View style={{backgroundColor: 'black', height: StatusBar.currentHeight}}></View>
                <ScrollView>
                    <ImageBackground source={{uri: this.state.dataSource.img.imgUrl}} style={{position: this.state.position, width: this.state.dataSource.img.width, height: 300}}>
                        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.38)', height: 300, justifyContent:'space-between'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({
                                    tab1:3,
                                    tab2:0,
                                    position: 'absolute'
                                })
                            }}>
                                <View style={{padding:20}}>
                                    <Text style={{paddingBottom: 5,color: '#FFFFFF', fontWeight: 'bold', borderBottomWidth: this.state.tab1, borderStyle: 'solid', borderBottomColor: '#C01E2F'}}>战报</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                this.setState({
                                    tab1:0,
                                    tab2:3,
                                    position: 'relative'
                                })
                            }}>
                                <View style={{padding:20}}>
                                    <Text style={{paddingBottom: 5,color: '#FFFFFF', fontWeight: 'bold', borderBottomWidth: this.state.tab2, borderStyle: 'solid', borderBottomColor: '#C01E2F'}}>数据</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {this.state.tab2?
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <View style={{flex:1}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{minWidth: 80}}></View>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#BDBDBD', fontSize: 12}}>01</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#BDBDBD', fontSize: 12}}>02</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#BDBDBD', fontSize: 12}}>03</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#BDBDBD', fontSize: 12}}>04</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#BDBDBD', fontSize: 12}}>ALL</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', minWidth: 80}}>
                                        <Image source={logo[home_id]} style={{width: 28, height: 28}}/>
                                        <Text style={{color: '#fff', fontSize: 12}}>{chineseShortName[home_id]}</Text>
                                    </View>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.home.section1}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.home.section2}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.home.section3}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.home.section4}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.home.score}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', minWidth: 80}}>
                                        <Image source={logo[away_id]} style={{width: 28, height: 28}}/>
                                        <Text style={{fontFamily: 'DINCond-Bold', color: '#fff', fontSize: 12}}>{chineseShortName[away_id]}</Text>
                                    </View>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.away.section1}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.away.section2}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.away.section3}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.away.section4}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', color: '#F2F2F2', fontSize: 14}}>{this.state.dataDetail.matchStats.away.score}</Text>
                                </View>
                            </View>
                        </View>
                        :null}
                        </View>
                    </ImageBackground>
                    {this.state.tab1?
                    <View style={{zIndex: 2, margin: 15, top:200, justifyContent: 'center'}}>
                        <View style={{borderStyle: 'solid', borderColor: '#F7F5F5', borderWidth: 1, backgroundColor: '#fff', elevation:0.5 }}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,}}>
                                <View>
                                    <Image source={logo[home_id]} style={{width: 88, height: 88, marginBottom: 5}}/>
                                    <Text style={{fontSize: 10, textAlign:'center'}}>{chineseName[home_id]}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                                        <Text style={{fontFamily: 'DINCond-Bold', fontSize: 42, color: home_color}}>{home_score}</Text>
                                        <Image source={require('../assets/images/nba.png')} style={{width: 8, height:20, margin: 10}}/>
                                        <Text style={{fontFamily: 'DINCond-Bold', fontSize: 42, color: away_color}}>{away_score}</Text>
                                    </View>
                                    <TouchableWithoutFeedback onPress={()=>{Linking.openURL(this.state.dataSource.collection)}}>
                                        <Image source={require('../assets/images/collection.png')} style={{width: 95, height:31}}/>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View>
                                    <Image source={logo[away_id]} style={{width: 88, height: 88, marginBottom: 10}}/>
                                    <Text style={{fontSize: 10, textAlign:'center'}}>{chineseName[away_id]}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 10}}>
                                <View style={{backgroundColor: color[home_id], height: 5, flex:1}}></View>
                                <View style={{backgroundColor: color[away_id], height: 5, flex:1}}></View>
                            </View>
                            <FlatList
                            data={this.state.dataSource.players}
                            keyExtractor={(item, index) => 'key'+index}
                            renderItem={({item})=>
                                <View style={{flexDirection: 'row', margin: 10}}>
                                    <Image source={{uri: item.url}} style={styles.header}/>
                                    <View style={{flex:1}}>
                                        <Text style={{marginLeft: 10}}>{item.name}</Text>
                                        <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
                                            <View style={{margin: 10}}>
                                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, textAlign: 'center'}}>{item.pts}</Text>
                                                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.38)'}}>得分</Text>
                                            </View>
                                            <View style={{margin: 10}}>
                                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, textAlign: 'center'}}>{item.reb}</Text>
                                                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.38)'}}>篮板</Text>
                                            </View>
                                            <View style={{margin: 10}}>
                                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, textAlign: 'center'}}>{item.ast}</Text>
                                                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.38)'}}>助攻</Text>
                                            </View>
                                            <View style={{margin: 10}}>
                                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, textAlign: 'center'}}>{item.ste}</Text>
                                                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.38)'}}>抢断</Text>
                                            </View>
                                            <View style={{margin: 10}}>
                                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, textAlign: 'center'}}>{item.blk}</Text>
                                                <Text style={{fontSize: 10, color: 'rgba(0, 0, 0, 0.38)'}}>盖帽</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }/>
                        </View>
                        <View style={{borderLeftColor: '#C01E2F', borderStyle:'solid', borderLeftWidth: 4, margin: 10, marginLeft:-5, paddingLeft: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.dataSource.title}</Text>
                        </View>
                        <FlatList 
                        data={this.state.dataSource.article}
                        style={{marginBottom: this.state.dataSource.img.height}}
                        keyExtractor={(item, index) => 'key'+index}
                        renderItem={({item})=>
                            <Text style={{ fontSize: 15, lineHeight: 30}}>{item}</Text>
                        }
                        />  
                    </View>
                    :<View style={{justifyContent: 'center'}}>
                        <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center', marginBottom: 10}}>
                            <TouchableWithoutFeedback onPress={()=>this.setState({tab3:0, tab4:1, tab5:1})}>
                                <View style={{backgroundColor: tabColor[this.state.tab3+1], borderColor: '#C01E2F', borderWidth:1, borderStyle: 'solid', alignItems: 'center', width:100, height: 30, justifyContent: 'center'}}>
                                    <Text style={{color:tabColor[this.state.tab3], textAlign: 'center'}}>球队对比</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.setState({tab3:1, tab4:0, tab5:1})}>
                                <View style={{backgroundColor: tabColor[this.state.tab4+1], borderColor: '#C01E2F', borderWidth:1, borderStyle: 'solid', width:100, height: 30, justifyContent: 'center'}}>
                                    <Text style={{color:tabColor[this.state.tab4], textAlign: 'center'}}>{chineseShortName[home_id]}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>this.setState({tab3:1, tab4:1, tab5:0})}>
                                <View style={{backgroundColor: tabColor[this.state.tab5+1], borderColor: '#C01E2F', borderWidth:1, borderStyle: 'solid', width:100, height: 30, justifyContent: 'center'}}>
                                    <Text style={{color:tabColor[this.state.tab5], textAlign: 'center'}}>{chineseShortName[away_id]}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {this.state.tab3?null:
                        <View>
                            <View style={{flexDirection: 'row',justifyContent: 'space-around', alignItems: 'center'}}>
                                <Image source={logo[home_id]} style={{width: 58, height: 58, marginBottom: 5, marginRight: 50}}/>
                                <Text style={{fontFamily: 'DINCond-Bold', fontSize: 22, color: 'rgba(0, 0, 0, 0.54)'}}>VS</Text>
                                <Image source={logo[away_id]} style={{width: 58, height: 58, marginBottom: 5, marginLeft:50}}/>
                            </View>
                            <FlatList 
                            data = {teamVertical}
                            keyExtractor={(item, index) => 'key'+index}
                            renderItem={({item, index})=>
                            <View style={{marginBottom: 30}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom:10, alignItems: 'center'}}>
                                    <Text style={{fontFamily: 'DINCond-Bold', fontSize: 20, color: 'rgba(0, 0, 0, 0.54)'}}>{this.state.dataDetail.homeAdvance[item][0]}</Text>
                                    <Text>{teamVerticalChinese[index]}</Text>
                                    <Text style={{fontFamily: 'DINCond-Bold', fontSize: 20, color: 'rgba(0, 0, 0, 0.54)'}}>{this.state.dataDetail.awayAdvance[item][0]}</Text>
                                </View>
                                <View style={{flexDirection:'row', flex:1}}>
                                    {this.state.dataDetail.homeAdvance[item][1] > this.state.dataDetail.awayAdvance[item][1]?
                                    <View style={{flexDirection:'row',flex:1}}>
                                        <View style={{height: 10, backgroundColor: '#F2F2F2', flex:1-this.state.dataDetail.homeAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1]) || 1}}></View>
                                        <View style={{height: 10, backgroundColor: '#C01E2F', flex:this.state.dataDetail.homeAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1])}}></View>
                                        <View style={{height: 10, backgroundColor: '#BDBDBD', flex:this.state.dataDetail.awayAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1])}}></View>
                                        <View style={{height: 10, backgroundColor: '#F2F2F2', flex:1-this.state.dataDetail.awayAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1]) || 1}}></View>
                                    </View>
                                    :<View style={{flexDirection:'row',flex:1}}>
                                        <View style={{height: 10, backgroundColor: '#F2F2F2', flex:1-this.state.dataDetail.homeAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1]) || 1}}></View>
                                        <View style={{height: 10, backgroundColor: '#BDBDBD', flex:this.state.dataDetail.homeAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1])}}></View>
                                        <View style={{height: 10, backgroundColor: '#C01E2F', flex:this.state.dataDetail.awayAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1])}}></View>
                                        <View style={{height: 10, backgroundColor: '#F2F2F2', flex:1-this.state.dataDetail.awayAdvance[item][1]/(this.state.dataDetail.homeAdvance[item][1]+this.state.dataDetail.awayAdvance[item][1]) || 1}}></View>
                                    </View>
                                    }
                                </View>
                            </View>
                            }
                            />
                        </View>
                        }
                        {this.state.tab4?null:
                        <View>
                        <FlatList
                        data={this.state.dataDetail.homeStartPlayer.concat(this.state.dataDetail.homeReservePlayer)}
                        keyExtractor={(item, index) => 'key'+index}
                        ListHeaderComponent={
                            <View style={{height:30,flexDirection: 'row', justifyContent:'space-around',flex:1, backgroundColor: '#E0E0E0', alignItems: 'center'}}>
                                <View style={{minWidth: 100}}>
                                    <Text>球员</Text>
                                </View>
                                <Text style={{minWidth: 20}}>时间</Text>
                                <Text style={{minWidth: 20}}>得分</Text>
                                <Text style={{minWidth: 20}}>篮板</Text>
                                <Text style={{minWidth: 20}}>助攻</Text>
                                <Text style={{minWidth: 40}}>投篮</Text>
                            </View>
                        }
                        renderItem={({item, index})=>
                        <View>
                        <TouchableWithoutFeedback onPress={()=>{this.setState({modalVisible: true, player_id: item.player_id})}}>
                           <View style={{flexDirection: 'row', flex:1}}>
                                <View style={{paddingLeft: 10, minWidth: 120, height:40, justifyContent: 'center', borderRightColor:'#E0E0E0', borderRightWidth:1,borderStyle:'solid'}}>
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent:'space-around',flex:1, backgroundColor: dataColor[index%2], height:40, alignItems:'center'}}>
                                    <Text style={{minWidth: 20}}>{item.mins}</Text>
                                    <Text style={{minWidth: 20}}>{item.pts}</Text>
                                    <Text style={{minWidth: 20}}>{item.reb}</Text>
                                    <Text style={{minWidth: 20}}>{item.asts}</Text>
                                    <Text style={{minWidth: 40}}>{item.fg}</Text>
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                        }
                        />
                        </View>
                        }
                        {this.state.tab5?null:
                        <FlatList
                        data={this.state.dataDetail.awayStartPlayer.concat(this.state.dataDetail.awayReservePlayer)}
                        keyExtractor={(item, index) => 'key'+index}
                        ListHeaderComponent={
                            <View style={{height:30,flexDirection: 'row', justifyContent:'space-around',flex:1, backgroundColor: '#E0E0E0', alignItems: 'center'}}>
                                <View style={{minWidth: 100}}>
                                    <Text>球员</Text>
                                </View>
                                <Text style={{minWidth: 20}}>时间</Text>
                                <Text style={{minWidth: 20}}>得分</Text>
                                <Text style={{minWidth: 20}}>篮板</Text>
                                <Text style={{minWidth: 20}}>助攻</Text>
                                <Text style={{minWidth: 40}}>投篮</Text>
                            </View>
                        }
                        renderItem={({item, index})=>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{paddingLeft: 10,minWidth: 120,height: 40, justifyContent:'center', borderRightColor:'#E0E0E0', borderRightWidth:1,borderStyle:'solid'}}>
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={{height: 40,flexDirection: 'row', justifyContent:'space-around',flex:1, backgroundColor: dataColor[index%2], alignItems: 'center'}}>
                                    <Text style={{minWidth: 20}}>{item.mins}</Text>
                                    <Text style={{minWidth: 20}}>{item.pts}</Text>
                                    <Text style={{minWidth: 20}}>{item.reb}</Text>
                                    <Text style={{minWidth: 20}}>{item.asts}</Text>
                                    <Text style={{minWidth: 40}}>{item.fg}</Text>
                                </View>
                            </View>
                        </View>
                        }
                        />
                        }
                    </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        width: 40, 
        height: 40, 
        ...Platform.select({
            ios: {
                borderRadius:15,
            },
            android: {
                borderRadius:50
            },
        }), 
    }
})