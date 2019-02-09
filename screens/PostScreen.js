import React from 'react';
import { Video } from 'expo';
import MD5  from"react-native-md5";
import HTML from 'react-native-render-html';
import ImageViewer from 'react-native-image-zoom-viewer';
import {View, Text, ActivityIndicator, FlatList, StyleSheet, ScrollView, Image, Dimensions ,ImageBackground, TouchableWithoutFeedback, Modal} from'react-native';

var images = []
export default class PostScreen extends React.Component {
    static navigationOptions = ({navigation}) =>({  
        headerStyle: {
            backgroundColor: '#fff',
            textAlign: 'center',
            elevation: 0
        },
        headerTitleStyle: {
            fontWeight: '300',
            textAlign:"center", 
            flex:1 ,
            marginRight: 50
        },
        headerTitle: navigation.getParam('name'),
        headerTintColor: 'rgba(0, 0, 0, 0.54)',
        gesturesEnabled: true
    });  
    constructor(props){
        super(props);
        this.state = {isLoading: true, modalVisible: false, index:0}
    }
    async componentDidMount() {
        images=[]
        const { navigation } = this.props;
        const fid = navigation.getParam('fid');
        const tid = navigation.getParam('tid');
        var time = new Date().getTime();
        var res = "client=316810195181635&crt=" + time +"&entrance=1&fid="+ fid +"&ft=18&night=0&nopic=0&nps=3&px=1080&tid="+tid+"&time_zone=Asia/ShanghaiHUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        var url = "https://bbs.mobileapi.hupu.com/1/7.1.1/threads/getThreadsSchemaInfo?fid="+fid+"&crt="+time+"&night=0&px=1080&sign="+sign+"&nopic=0&time_zone=Asia%2FShanghai&tid="+tid+"&ft=18&nps=3&client=316810195181635&entrance=1"
        var url_light = "http://bbs.mobileapi.hupu.com/1/7.1.1/threads/getsThreadLightReplyList?offline=json&tid="+tid+"&fid="+fid+"&nopic=0&night=0&order=asc&entrance=&client=861608045774351&webp=1"
        var url_reply = "http://bbs.mobileapi.hupu.com/1/7.1.1/threads/getsThreadPostList?offline=json&page=1&tid="+tid+"&fid="+fid+"&nopic=0&night=0&order=asc&entrance=&show_type=default&client=316810195181635&webp=1"
        var result = await fetch(url_light)
        var resultJson_light = await result.json();
        result = await fetch(url_reply)
        var resultJson_reply = await result.json();
        return fetch(url)
            .then((Response)=>Response.json())
            .then((ResponseJson) =>{
                console.log(url);
                this.setState({
                    isLoading: false,
                    dataSource: ResponseJson,
                    lightSource: resultJson_light.data,
                    replySource: resultJson_reply.data.result
                })
            })
    }
    alterNode(node) {
        node.attribs = { ...(node.attribs || {}), style: `line-height: 28%; font-size: 18%` };
    }

    alterNode_reply(node) {
        const { name } = node;
        if (name == 'img') {
            node.attribs.src = node.attribs.data_url;
            var w = Dimensions.get("window").width-20;
            var h = w * Number(node.attribs['data-h']) / Number(node.attribs['data-w']);
            node.attribs = { ...(node.attribs || {}), style: `width: ${w}; height: ${h}` };
            return node;
        }
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 16%;` };
    }

    alterNode_quote(node) {
        const { name } = node;
        if (name == 'img') {
            node.attribs.src = node.attribs.data_url;
            var w = Dimensions.get("window").width-20;
            var h = w * Number(node.attribs['data-h']) / Number(node.attribs['data-w']);
            node.attribs = { ...(node.attribs || {}), style: `width: ${w}; height: ${h}` };
            return node;
        }
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 16%; color:'rgba(0, 0, 0, 0.54)'` };
    }

    renderers() {
        return {
            img: (htmlAttribs)=>{
                htmlAttribs.src = htmlAttribs.data_url;
                var w = Dimensions.get("window").width-20;
                var h = w * Number(htmlAttribs['data-h']) / Number(htmlAttribs['data-w']);
                for(var i=0; i<images.length; i++){
                    if(images[i].url == htmlAttribs.src)
                        break;
                }
                if(i == images.length)
                    images.push({url:htmlAttribs.src})
                return (
                    <TouchableWithoutFeedback key={htmlAttribs.src} onPress={() => this.setState({ modalVisible: true, index:i})}>
                        <Image key={htmlAttribs.src} source={{uri: htmlAttribs.src}}  resizeMode='contain' style={{width:w,height:h, marginBottom: 10}}/>             
                    </TouchableWithoutFeedback>
                    
                ) 
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
                    <Video 
                        source={{uri: res.video_info.src}} 
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="contain"
                        shouldPlay
                        useNativeControls={true}
                        shouldPlay={false}
                        style={{ width: Dimensions.get("window").width, height: 200 }}
                    />
                }
                <Modal
                visible={this.state.modalVisible}
                transparent={false}
                animationType={"fade"}
                onRequestClose={() => this.setState({ modalVisible: false })}
                style={{height:Dimensions.get("window").height}}
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
                <ScrollView showsVerticalScrollIndicator = {false}>
                <View style={styles.header}>
                    <Text style={{fontSize:22,fontWeight:'500', marginBottom:5}}>{res.title}</Text>
                    <View style={{flexDirection:'row', marginBottom: 10, marginTop: 10}}>
                        <Image source={{uri: res.userImg}} style={{width: 30, height: 30, marginRight:5, borderRadius:50}}/>
                        <View style={{ marginLeft: 10}}>
                            <Text style={{fontSize:12}}>{res.username}</Text>
                            <Text style={{color:'#9A9898', fontSize:12, paddingRight:5}}>{res.time} 阅读 {res.visits}</Text>
                        </View>
                    </View>
                    <HTML html={res.content || res.error.text} alterNode={this.alterNode} renderers={this.renderers()}/> 
                </View>    
                {res.error?null:
                    <View>           
                        <ImageBackground source={require('../assets/images/timeCard.png')} style={{width:128, height: 22 ,margin: 16}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../assets/images/light.png')} style={{width: 11, height: 14, marginRight:3, tintColor :'#FFFFFF'}}/>
                                <Text style={{color:'#FFFFFF', textAlign: 'center'}}>这些评论亮了</Text>
                            </View>
                        </ImageBackground>
                        <FlatList
                            data={this.state.lightSource.list}
                            keyExtractor={item => item.pid} 
                            renderItem={({item}) =>
                            <View style={styles.card}>
                                <Image source={{uri: item.userImg}} style={{width: 30, height: 30, marginRight:5, borderRadius:50}}/>
                                <View style={{flex:1}}>
                                    <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.userName}</Text>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.time}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                            <Image source={require('../assets/images/light.png')} style={{width: 9, height: 11.5, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                        </View>
                                    </View>
                                    {item.quote&&item.quote.length!=0?
                                    <View style={styles.quote}>
                                        {item.quote[0].header.length!=0?
                                        <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote[0].header[0].slice(item.quote[0].header[0].indexOf('>')+1, item.quote[0].header[0].indexOf('<', 6))}</Text>
                                        :null
                                        }
                                        <HTML html={item.quote[0].content} style={{padding: 10}} alterNode={this.alterNode} imagesMaxWidth={Dimensions.get("window").width-75} alterNode={this.alterNode_quote}/>
                                    </View>
                                    :null
                                    }
                                    <HTML html={item.content} alterNode={this.alterNode} style={{padding: 10}}  imagesMaxWidth={Dimensions.get("window").width-65} alterNode={this.alterNode_reply}/>
                                </View>
                            </View>
                            }
                        />
                    </View>
                }
                {res.error?null:
                    <View>
                        <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:80, height: 22 ,margin: 16, alignItems: 'center'}}>
                            <Text style={{color:'#FFFFFF', textAlign: 'center'}}>最新评论</Text>
                        </ImageBackground>
                        <FlatList
                            data={this.state.replySource.list}
                            keyExtractor={item => item.pid} 
                            renderItem={({item}) =>
                            <View style={styles.card}>
                                <Image source={{uri: item.userImg}} style={{width: 30, height: 30, marginRight:5, borderRadius:50}}/>
                                <View style={{flex:1}}>
                                    <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.userName}</Text>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.time}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                            <Image source={require('../assets/images/light.png')} style={{width: 9, height: 11.5, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                        </View>
                                    </View>
                                    {item.quote&&item.quote.length!=0?
                                    <View style={styles.quote}>
                                        {item.quote[0].header.length!=0?
                                        <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote[0].header[0].slice(item.quote[0].header[0].indexOf('>')+1, item.quote[0].header[0].indexOf('<', 6))}</Text>
                                        :null
                                        }
                                        <HTML html={item.quote[0].content} style={{padding: 10}} alterNode={this.alterNode} imagesMaxWidth={Dimensions.get("window").width-75} alterNode={this.alterNode_quote}/>
                                    </View>
                                    :null
                                    }
                                    <HTML html={item.content} alterNode={this.alterNode}  style={{padding: 10}}  imagesMaxWidth={Dimensions.get("window").width-65} alterNode={this.alterNode_reply}/>
                                </View>
                            </View>
                            }
                        />
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
    }
});
