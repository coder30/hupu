import React from 'react';
import Team from '../components/Team';
import Game from '../components/Game';
import Player from '../components/Player';
import Injury from '../components/Injury';
import Honour from '../components/Honour';
import LogoTitle from '../components/LogoTitle';
import { View, StyleSheet, Text, FlatList, ImageBackground, TouchableWithoutFeedback} from 'react-native';
let gestureHandlers = {};
let lastPick = new Date();
const tab = [{name: '赛程', index:'1'},{name: '球队榜', index:'2'},{name: '球员榜', index:'3'},{name: '新秀榜', index:'4'},{name: '日榜', index:'5'},{name: '伤病', index:'6'},{name: '荣誉榜', index:'7'}]
export default class LinksScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: '#C01E2F',
    },
  };

  constructor(props){
    super(props);
    this.config = {changeX: 0}
    this.state = {tab:'1'}
  }
  componentWillMount(){
    gestureHandlers = {
      onStartShouldSetResponder: (e) => {
        return true
      },
      onMoveShouldSetResponder: (e) => {return true},
      onResponderGrant: (e) => {
        this.config.changeX = e.nativeEvent.pageX;
      },
      onResponderMove: (e) => {
        let now = new Date();
        if(now - lastPick > 500){
          if(this.config.changeX > e.nativeEvent.pageX){
            if(Number(this.state.tab) < 7){
              this.setState({tab: Number(this.state.tab)+1});
              if(this.state.tab=='5'){
                this.goIndex(6)
              }
            }
            lastPick = now;
          }
          else {
            if(Number(this.state.tab) > 1){
              this.setState({tab:Number(this.state.tab)-1});
              if(this.state.tab=='3')
                this.goIndex(0)
            }
            lastPick = now;
          }
        }
        
      },
      onResponderRelease: (e) => {
        
      },
    }
  }
  goIndex = (index) => {
    this.flatListRef.scrollToIndex({animated: true, index: index});
  };
  render() {
    return (
      <View style={styles.container} {...gestureHandlers}>
        <View>
          <FlatList
            data={tab}
            horizontal={true}
            extraData={this.state}
            keyExtractor={(item, index) => 'key'+index}
            showsHorizontalScrollIndicator = {false}
            ref={(ref) => { this.flatListRef = ref; }}
            renderItem={({item}) =>
            <View style={{margin: 16}}>
              {this.state.tab == item.index?
              <ImageBackground source={require('../assets/images/Rectangle.png')} style={{width:57, height: 22 , alignItems: 'center'}}>
                <Text style={{color:'#FFFFFF', textAlign: 'center', lineHeight: 22}}>{item.name}</Text>
              </ImageBackground>
              :<TouchableWithoutFeedback onPress={() => {
                  this.setState({ tab:item.index });
                }}>
                <Text style={{lineHeight: 22, color:"rgba(0, 0, 0, 0.54)"}}>{item.name}</Text>
              </TouchableWithoutFeedback>
              }
            </View>
            }
          />
        </View>
        {this.state.tab=='1'?<Game navigate={this.props.navigation.navigate}/>:null}
        {this.state.tab=='2'?<Team/>:null}
        {this.state.tab=='3'?<Player type='regular'/>:null}
        {this.state.tab=='4'?<Player type='rookie'/>:null}
        {this.state.tab=='5'?<Player type='daily'/>:null}
        {this.state.tab=='6'?<Injury/>:null}
        {this.state.tab=='7'?<Honour/>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});
