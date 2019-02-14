import React from 'react';
import MD5  from"react-native-md5";
import HTML from 'react-native-render-html';
import ImageViewer from 'react-native-image-zoom-viewer';
import ScaledImage from '../components/ScaledImage';
import Rectangle from '../components/Rectangle';
import {ScrollView, Modal, View, FlatList ,ActivityIndicator, Text, StyleSheet, Image, TouchableWithoutFeedback, Dimensions, ImageBackground, StatusBar, Linking } from 'react-native';

const images = []
export default class NewsScreen extends React.Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: '#fff',
        gesturesEnabled: true,
    };
    constructor(props){
        super(props);
        this.state = {isLoading: true, nid: 0, count: 0,modalVisible: false, index:0};
    }
    async componentDidMount() {
        const { navigation } = this.props;
        const nid = navigation.getParam('nid');
        const replies = navigation.getParam('replies');
        var time = new Date().getTime();
        var res = "cate_type=news&channel=hupucom&client=316810195181635&crt="+time+"&entrance=1&ft=18&nid="+nid+"&night=0&nopic=0&replies="+replies+"&time_zone=Asia/Shanghai&top_ncid=-1HUPU_SALT_AKJfoiwer394Jeiow4u309"
        var sign = MD5.hex_md5(res);
        var url = "https://games.mobileapi.hupu.com/1/7.1.1/nba/getNewsDetailSchema?crt="+time+"&night=0&channel=hupucom&nid="+nid+"&sign="+sign+"&nopic=0&time_zone=Asia/Shanghai&cate_type=news&ft=18&top_ncid=-1&replies="+replies+"&client=316810195181635&entrance=1"
        var url_reply = "http://games.mobileapi.hupu.com/1/7.1.1/news/getCommentH5?offline=json&nid="+nid+"&top_ncid=-1&client=861608045774351&webp=1"
        var result = await fetch(url_reply);
        result = await result.json()
        return fetch(url)
            .then((Response)=>Response.json())
            .then((ResponseJson)=>{
                console.log(url);
                ResponseJson.result.offline_data.data.news.content = ResponseJson.result.offline_data.data.news.content.replace("<p><strong>友情提示：您当前使用的是已不再维护的旧版客户端，<a href=\"https://mobile.hupu.com/download/games?_r=updateViaOldVersionContent\">赶紧点这里升级吧 >></a></strong></p>", " ")
                this.setState({
                    isLoading: false,
                    dataSource: ResponseJson.result.offline_data.data.news,
                    replySource: result.data,
                })
            })
    }
    alterNode(node) {
        const { name } = node;
        if(name=='a'){
            node.attribs.href = node.attribs.href.replace("browser://", "")
        }
        node.attribs = { ...(node.attribs || {}), style: `line-height: 28%; font-size: 18%` };
    }
    alterNode_reply(node) {
        const { name } = node;
        if (name == 'img') {
            node.attribs.src = node.attribs.data_url;
            var w = Dimensions.get("window").width-20;
            var w = Dimensions.get("window").width-20;
            var h = w * Number(node.attribs['data-h']) / Number(node.attribs['data-w']);
            node.attribs = { ...(node.attribs || {}), style: `width: ${w}; height: ${h}` };
            return node;
        }
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 15%;` };
    }

    renderers() {
        return {
            img: (htmlAttribs)=>{
                var w = Dimensions.get("window").width-20;
                for(var i=0; i<images.length; i++){
                    if(images[i].url == htmlAttribs.src)
                        break;
                }
                if(i == images.length)
                    images.push({url:htmlAttribs.src})
                return (
                    <TouchableWithoutFeedback key={htmlAttribs.src} onPress={() =>this.setState({ modalVisible: true, index:i })}>
                        <ScaledImage uri={htmlAttribs.src} width={w}/>             
                    </TouchableWithoutFeedback>
                    
                ) 
            }
        }
    }

    alterNode_quote(node) {
        const { name } = node;
        if (name == 'img') {
            node.attribs.src = node.attribs.data_url;
            var w = Dimensions.get("window").width-20;
            var h = w * Number(node.attribs['data-h']) / Number(node.attribs['data-w']);
            node.attribs = { ...(node.attribs || {}), style: `width: ${w}; height: ${h};` };
            return node;
        }
        node.attribs = { ...(node.attribs || {}), style: `line-height: 25%; font-size: 15%; color:'rgba(0, 0, 0, 0.54)'` };
    }
    render() {
        if(this.state.isLoading){
            return(
              <View style={{flex: 1, padding: 50}}>
                <ActivityIndicator color ="#C01E2F"/>
              </View>
            )
        }
        return(
            <View>
            <View style={{backgroundColor: 'black', height: StatusBar.currentHeight}}></View>
            <Modal
                visible={this.state.modalVisible}
                transparent={false}
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
                    enablePreload={true}
                />
            </Modal>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <Image source={{uri: this.state.dataSource.img_m}} resizeMode='cover' style={{ width:Dimensions.get("window").width, height: Dimensions.get("window").width*202/360, justifyContent:'center', alignItems:'center'}} />
                <View style={{padding: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>{this.state.dataSource.title}</Text>
                    <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>来源:{this.state.dataSource.origin}   {this.state.dataSource.addtime}</Text>
                    <HTML html={this.state.dataSource.content} alterNode={this.alterNode} renderers={this.renderers()} onLinkPress={(evt, href)=>Linking.openURL(href)}/>  
                </View>
                {this.state.replySource.count=="0" || this.state.replySource.light_comments.length==0?null:
                <View>
                    <Rectangle type="light"/>  
                    <FlatList
                        data={this.state.replySource.light_comments}
                        keyExtractor={(item, index) => 'key'+index}
                        renderItem={({item}) =>
                        <View style={styles.card}>
                            <Image source={{uri: item.header}} style={{width: 30, height: 30, marginRight:5, borderRadius:50}}/>
                            <View style={{flex:1, marginBottom: 4}}>
                                <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.user_name}</Text>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.format_time}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                        <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                    </View>
                                </View>
                                {item.quote_data?
                                <View style={styles.quote}>
                                    <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote_data.user_name}</Text>
                                    <HTML html={item.quote_data.content} style={{padding: 10}} imagesMaxWidth={Dimensions.get("window").width-75} alterNode={this.alterNode_quote}/>
                                </View>
                                :null
                                }
                                <HTML html={item.content} style={{padding: 10}}  imagesMaxWidth={Dimensions.get("window").width-65} alterNode={this.alterNode_reply}/>  
                            </View>
                        </View>
                        }
                    />
                </View>
                }
                {this.state.replySource.count==0?<Text>没有评论</Text>:
                <View style={{marginBottom: 30}}>
                    <Rectangle type="reply"/>
                    <FlatList
                        data={this.state.replySource.data}
                        keyExtractor={(item, index) => 'key'+index}
                        renderItem={({item}) =>
                        <View style={styles.card}>
                            <Image source={{uri: item.header}} style={{width: 30, height: 30, marginRight:5, borderRadius:50}}/>
                            <View style={{flex:1, marginBottom: 4}}>
                                <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5}}>{item.user_name}</Text>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: 10}}>{item.format_time}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text style={{color: 'rgba(0, 0, 0, 0.54)', marginRight: 5, fontSize: 11}}>{item.light_count}</Text>
                                        <Image source={require('../assets/images/light.png')} style={{width: 18, height: 18, marginRight:3, tintColor :'rgba(0, 0, 0, 0.38)', alignItems: 'center'}}/>
                                    </View>
                                </View>
                                {item.quote_data?
                                <View style={styles.quote}>
                                    <Text style={{color:'rgba(0, 0, 0, 0.54)', fontSize: 12}}>{item.quote_data.user_name}</Text>
                                    <HTML html={item.quote_data.content} style={{padding: 10}} imagesMaxWidth={Dimensions.get("window").width-75} alterNode={this.alterNode_quote}/>
                                </View>
                                :null
                                }
                                <HTML html={item.content} style={{padding: 10}}  imagesMaxWidth={Dimensions.get("window").width-65} alterNode={this.alterNode_reply}/>  
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
    quote: {
        backgroundColor: '#F2F2F2',
        padding: 5,
        marginBottom: 10,
        marginTop: 10
    }
})