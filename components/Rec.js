import React from 'react';
import{View, StyleSheet} from 'react-native'
class TriangleCorner  extends React.Component {
    render() {
        return <View style={[styles.triangleCorner]} />
    }
}
class TriangleCornerBottomRight extends React.Component {
    render() {
        return (
            <TriangleCorner style={styles.triangleCornerBottomRight}/>
        )
    }
}

class Rectangle extends React.Component {
    render() {
        return (
            <View style={styles.parallelogram}>
              <TriangleCornerBottomRight style={styles.parallelogramRight} />
              <View style={styles.parallelogramInner} />
              <TriangleCorner  style={styles.parallelogramLeft} />
            </View>
        )
    }
}
export{TriangleCorner}

const styles = StyleSheet.create({
    triangleCorner: {
      borderBottomColor: '#F2F2F2',
      borderStyle: 'solid',
      borderBottomWidth: 0.5,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
      flexDirection:'row',
      paddingTop: 6
    },
    triangleCornerBottomRight: {
        transform: [
          {rotate: '180deg'}
        ]
    },
    parallelogram: {
        width: 150,
        height: 100
    },
    parallelogramInner: {
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: 'red',
        width: 150,
        height: 100,
    },
    parallelogramRight: {
        top: 0,
        right: -50,
        position: 'absolute'
    },
    parallelogramLeft: {
        top: 0,
        left: -50,
        position: 'absolute'
    }
})
