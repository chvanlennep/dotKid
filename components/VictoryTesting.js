import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryAxis,
  VictoryLegend,
  VictoryLabel,
  VictoryArea,
  Point,
  createContainer,
} from 'victory-native';

const VictoryVoronoiContainer = createContainer('voronoi');

// const data = [
//   {quarter: 1, earnings: 13000},
//   {quarter: 2, earnings: 16500},
//   {quarter: 3, earnings: 14250},
//   {quarter: 4, earnings: 19000},
// ];

const VictoryTesting = () => {
  return (
    <View style={styles.container}>
      <VictoryChart
        height={400}
        width={400}
        containerComponent={<VictoryVoronoiContainer />}>
        <VictoryGroup
          color="#c43a31"
          labels={({datum}) => `y: ${datum.y}`}
          labelComponent={
            <VictoryTooltip style={{fontSize: 10}} renderInPortal={false} />
          }
          data={[
            {x: 1, y: -3},
            {x: 2, y: 5},
            {x: 3, y: 3},
            {x: 4, y: 0},
            {x: 5, y: -2},
            {x: 6, y: -2},
            {x: 7, y: 5},
          ]}>
          <VictoryLine />
          <VictoryScatter size={({active}) => (active ? 8 : 3)} />
        </VictoryGroup>
        <VictoryGroup
          labels={({datum}) => `y: ${datum.y}`}
          labelComponent={
            <VictoryTooltip style={{fontSize: 10}} renderInPortal={false} />
          }
          data={[
            {x: 1, y: 3},
            {x: 2, y: 1},
            {x: 3, y: 2},
            {x: 4, y: -2},
            {x: 5, y: -1},
            {x: 6, y: 2},
            {x: 7, y: 3},
          ]}>
          <VictoryLine />
          <VictoryScatter size={({active}) => (active ? 8 : 3)} />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VictoryTesting;
