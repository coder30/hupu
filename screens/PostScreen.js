import React from 'react';
import { Video } from 'expo';
import MD5  from"react-native-md5";
import { Platform } from 'react-native';
import HTML from 'react-native-render-html';
import Rectangle from '../components/Rectangle';
import ScaledImage from '../components/ScaledImage';
import ImageViewer from 'react-native-image-zoom-viewer';
import {View, Text,Linking, ActivityIndicator, FlatList, StyleSheet, ScrollView, Image, Dimensions ,StatusBar, TouchableWithoutFeedback, Modal} from'react-native';

var images = []
var flag = true;
var page=2;
let lastPick = new Date();

export default class PostScreen extends React.Component {
    static navigationOptions = ({navigation}) =>({  
        headerTitle: 
        <TouchableWithoutFeedback onPress={()=>{
            let now = new Date();
            if(now - lastPick < 500){
                navigation.getParam('_scrollToTop', '')();
            }
            lastPick = now;
        }}>
            <View style={{justifyContent: 'center', flex: 1}}>
                <Text style={{textAlign: 'center',marginLeft:-50,fontSize:18,fontWeight: '300', color: 'rgba(0, 0, 0, 0.54)'}}>{navigation.getParam('title', '')}</Text>
            </View>
        </TouchableWithoutFeedback>,
        headerTintColor: 'rgba(0, 0, 0, 0.54)',
        gesturesEnabled: true,
        gestureResponseDistance: 45
    });  
    constructor(props){
        super(props);
        this.state = {isLoading: true, modalVisible: false, index:0,isPortrait: true}
    }
    async componentDidMount() {
        this.props.navigation.setParams({ _scrollToTop: this._scrollToTop })
        page=2;
        flag = true;
        images=[];
        StatusBar.setBarStyle('dark-content');
        const { navigation } = this.props;
        const fid = navigation.getParam('fid');
        const tid = navigation.getParam('tid');
        var time = new Date().getTime();
        var res = "client=316810195181635&crt=" + time +"&entrance=1&fid="+ fid +"&ft=18&night=0&nopic=0&nps=3&px=1080&tid="+tid+"&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        var url = "https://bbs.mobileapi.hupu.com/1/7.1.1/threads/getThreadsSchemaInfo?fid="+fid+"&crt="+time+"&night=0&px=1080&sign="+sign+"&nopic=0&time_zone=Asia%2FShanghai&tid="+tid+"&ft=18&nps=3&client=316810195181635&entrance=1"
        var url_light = "http://bbs.mobileapi.hupu.com/1/7.1.1/threads/getsThreadLightReplyList?offline=json&tid="+tid+"&fid="+fid+"&nopic=0&night=0&order=asc&entrance=&client=861608045774351&webp=1"
        var url_reply = "http://bbs.mobileapi.hupu.com/1/7.1.1/threads/getsThreadPostList?offline=json&page=1&tid="+tid+"&fid="+fid+"&nopic=0&night=0&order=asc&entrance=&show_type=default&client=316810195181635&webp=1"
        return fetch(url)
            .then((Response)=>Response.json())
            .then(async (ResponseJson) =>{
                this.props.navigation.setParams({ title: ResponseJson.forum_name })
                var result = await fetch(url_light)
                var resultJson_light = await result.json();
                result = await fetch(url_reply)
                var resultJson_reply = await result.json();
                ResponseJson.offline_data.data.content = ResponseJson.offline_data.data.content.replace("<div><a  class=\"app_tips_hide\" href=\"https://mobile.hupu.com/download/games/?r=newsThreadBBall\" target=\"_blank\">下载能看专业及时的新闻，还能实时查看球员赛场投篮点分布图的篮球App</a></div><br /><br />", "")
                this.setState({
                    isLoading: false,
                    dataSource: ResponseJson,
                    lightSource: resultJson_light.data,
                    replySource: resultJson_reply.data.result
                })
            })
    }
    componentWillUnmount(){
        StatusBar.setBarStyle('light-content');
    }
    _scrollToTop = () => {
        if(!!this.listRef){
          this.listRef.scrollTo({x: 0, y: 0, animated: true});
        }
    }
    alterNode(node) {
        node.attribs = { ...(node.attribs || {}), style: `line-height: 28%; font-size: 18%` };
    }

    alterNode_reply(node) {
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 16%;` };
    }

    alterNode_quote(node) {
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 16%; color:'rgba(0, 0, 0, 0.54)'` };
    }

    renderers(width) {
        return {
            img: (htmlAttribs)=>{
                if(!htmlAttribs.data_url)
                    return <View key={Math.random()}></View>
                htmlAttribs.src = htmlAttribs.data_url;
                let h = 0;
                if(htmlAttribs['data-h']==undefined){
                    let start = htmlAttribs.src.indexOf('w_')+2;
                    let end = htmlAttribs.src.indexOf('_h');
                    let originWidth = htmlAttribs.src.slice(start, end);
                    start = htmlAttribs.src.indexOf('h_')+2;
                    end = htmlAttribs.src.indexOf('_', start+2);
                    let originHeight = htmlAttribs.src.slice(start, end);
                    h = width * Number(originHeight) / Number(originWidth);
                }
                else
                    h = width * Number(htmlAttribs['data-h']) / Number(htmlAttribs['data-w']);
                for(var i=0; i<images.length; i++){
                    if(images[i].url == htmlAttribs.src)
                        break;
                }
                if(i == images.length)
                    images.push({url:htmlAttribs.src})
                if(!h){
                    return (
                        <TouchableWithoutFeedback key={Math.random()} onPress={() => this.setState({ modalVisible: true, index:i})}>
                            <ScaledImage uri={htmlAttribs.src}  width={width}/>             
                        </TouchableWithoutFeedback>
                    )
                }
                return (
                    <TouchableWithoutFeedback key={Math.random()} onPress={() => this.setState({ modalVisible: true, index:i})}>
                        <Image source={{uri: htmlAttribs.src}}  style={{width:width,height:h, marginBottom: 10, backgroundColor: '#E5E5E5'}}/>             
                    </TouchableWithoutFeedback>
                ) 
            }
        }
    }
    async _contentViewScroll(e){
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (offsetY + oriageScrollHeight >= contentSizeHeight-800){
            if(flag){
                flag = false;
                const { navigation } = this.props;
                const fid = navigation.getParam('fid');
                const tid = navigation.getParam('tid');
                var url_reply = "http://bbs.mobileapi.hupu.com/1/7.1.1/threads/getsThreadPostList?offline=json&page="+page+"&tid="+tid+"&fid="+fid+"&nopic=0&night=0&order=asc&entrance=&show_type=default&client=316810195181635&webp=1"
                var result = await fetch(url_reply)
                var resultJson_reply = await result.json();
                var list = this.state.replySource.list.concat(resultJson_reply.data.result.list);
                this.state.replySource.list = list;
                page++;
                this.setState({
                    replySource: this.state.replySource,
                })
                if(page<=resultJson_reply.data.result.all_page)
                    flag = true;
            }
        }
    }
    render() {
        var res;
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator color ="#C01E2F"/>
              </View>
            )
        }
        else {
            res = this.state.dataSource.offline_data.data;
        }
        return (
            <View>
                {res.video_info.length==0?null:
                <View style={{backgroundColor: 'black'}}>
                    <Video
                    source={{ uri: res.video_info.src }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    useNativeControls
                    style={{ width: Dimensions.get("window").width, height: 200 }}
                    />
                </View>
                }
                <Modal
                visible={this.state.modalVisible}
                transparent={false}
                animationType={"fade"}
                onRequestClose={() => this.setState({ modalVisible: false })}
                >
                <ImageViewer
                    imageUrls={images}
                    index={this.state.index}
                    onClick={() => {
                        this.setState({ modalVisible: false })
                    }}
                    onSwipeDown={() => {
                        this.setState({ modalVisible: false })
                    }}
                    enableSwipeDown={true}
                />
                </Modal>
                <ScrollView 
                    showsVerticalScrollIndicator = {false} 
                    onMomentumScrollEnd = {this._contentViewScroll.bind(this)}
                    ref={(ref) => { this.listRef = ref; }}>
                    <View style={styles.header}>
                        <Text style={{fontSize:22,fontWeight:'500', marginBottom:5}}>{res.title}</Text>
                        <View style={{flexDirection:'row', marginBottom: 10, marginTop: 10}}>
                            <Image source={{uri: res.userImg}} style={styles.avatar}/>
                            <View style={{ marginLeft: 10}}>
                                <Text style={{fontSize:12}}>{res.username}</Text>
                                <Text style={{color:'#9A9898', fontSize:12, paddingRight:5}}>{res.time} 阅读 {res.visits}</Text>
                            </View>
                        </View>
                        <HTML html={res.content || res.error.text} alterNode={this.alterNode} renderers={this.renderers(Dimensions.get("window").width-20)} onLinkPress={(evt, href)=>Linking.openURL(href)}/> 
                    </View>    
                    {res.error || !this.state.lightSource.list.length?null:
                        <View>
                            <Rectangle type="light"/>           
                            <FlatList
                                data={this.state.lightSource.list}
                                keyExtractor={(item, index) => 'key'+index} 
                                renderItem={({item}) =>
                                <View style={styles.card}>
                                    <Image source={{uri: item.userImg}} style={styles.avatar}/>
                                    <View style={{flex:1}}>
                                        <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.userName}</Text>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.time}</Text>
                                                {item.userName==res.username?
                                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.12)', marginLeft: 10, borderRadius: 5, padding:2}}>
                                                    <Text style={{fontSize: 10, color:'rgba(0, 0, 0, 0.5)'}}>楼主</Text>
                                                </View>
                                                :null
                                                }
                                            </View>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                                <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                            </View>
                                        </View>
                                        {item.quote&&item.quote.length!=0?
                                        <View style={styles.quote}>
                                            {item.quote[0].header.length!=0?
                                            <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote[0].header[0].slice(item.quote[0].header[0].indexOf('>')+1, item.quote[0].header[0].indexOf('<', 6))}</Text>
                                            :null
                                            }
                                            <HTML html={item.quote[0].content} style={{padding: 10}} alterNode={this.alterNode_quote} renderers={this.renderers(Dimensions.get("window").width-75)} onLinkPress={(evt, href)=>Linking.openURL(href)}/>
                                        </View>
                                        :null
                                        }
                                        <HTML html={item.content} style={{padding: 10}}  alterNode={this.alterNode_reply} renderers={this.renderers(Dimensions.get("window").width-65)} onLinkPress={(evt, href)=>Linking.openURL(href)}/>
                                    </View>
                                </View>
                                }
                            />
                        </View>
                    }
                    {res.error || !this.state.replySource.list.length?null:
                        <View style={{marginBottom: 20}}>
                            <Rectangle type="reply"/>
                            <FlatList
                                data={this.state.replySource.list}
                                keyExtractor={(item, index) => 'key'+index}
                                extraData={this.state}
                                renderItem={({item}) =>
                                <View style={styles.card}>
                                    <Image source={{uri: item.userImg}} style={styles.avatar}/>
                                    <View style={{flex:1}}>
                                        <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.userName}</Text>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.time}</Text>
                                                {item.userName==res.username?
                                                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.12)', marginLeft: 10, borderRadius: 5,padding:2}}>
                                                    <Text style={{fontSize: 10, color:'rgba(0, 0, 0, 0.5)'}}>楼主</Text>
                                                </View>
                                                :null
                                                }
                                            </View>
                                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                                <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                            </View>
                                        </View>
                                        {item.quote&&item.quote.length!=0?
                                        <View style={styles.quote}>
                                            {item.quote[0].header.length!=0?
                                            <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote[0].header[0].slice(item.quote[0].header[0].indexOf('>')+1, item.quote[0].header[0].indexOf('<', 6))}</Text>
                                            :null
                                            }
                                            <HTML html={item.quote[0].content} style={{padding: 10}} alterNode={this.alterNode_quote} renderers={this.renderers(Dimensions.get("window").width-75)} onLinkPress={(evt, href)=>Linking.openURL(href)}/>
                                        </View>
                                        :null
                                        }
                                        <HTML html={item.content}  style={{padding: 10}} alterNode={this.alterNode_reply} renderers={this.renderers(Dimensions.get("window").width-65)} onLinkPress={(evt, href)=>Linking.openURL(href)}/>
                                    </View>
                                </View>
                                }
                            />
                            {page>this.state.replySource.all_page?null:
                            <View style={{flex: 1, padding: 20}}>
                                <ActivityIndicator color ="#C01E2F"/>
                            </View>
                            }
                        </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        borderBottomColor: '#ECEBEB',
        borderBottomWidth: 1,
        padding: 15
    },
    card: {
        borderBottomColor: '#F2F2F2',
        borderStyle: 'solid',
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection:'row',
        paddingTop: 6
    },
    lightReply: {
        borderBottomColor: '#ECEBEB',
        borderBottomWidth: 1,
        borderTopColor: '#ECEBEB',
        borderTopWidth: 1,
        borderLeftColor: '#D91E1E',
        borderLeftWidth: 3,
        marginBottom:10,
        marginTop: 10
    },
    replyCard: {
        borderBottomColor: '#ECEBEB',
        borderBottomWidth: 1,
        padding:10
    },
    quote: {
        backgroundColor: '#F2F2F2',
        padding: 5,
        marginBottom: 10,
        marginTop: 10
    },
    avatar: {
        width: 30, 
        height: 30, 
        marginRight:5,
        ...Platform.select({
            ios: {
                borderRadius:15,
            },
            android: {
                borderRadius:50
            },
        }), 
    }
});
