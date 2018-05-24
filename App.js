import React from 'react'
import { Button, Card } from 'react-native-elements'
import { StyleSheet, Text, View } from 'react-native'

import Deck from './src/component/Deck'

const DATA = [
  { id: 1, text: 'Card #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 2, text: 'Card #2', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 3, text: 'Card #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 4, text: 'Card #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
]

export default class App extends React.PureComponent {
  _renderCard = ({ item }) => (
    <Card
      key={item.id}
      image={{ uri: item.uri }}
      title={item.text}
    >
      <Text style={styles.cardText}>
        Ais isd ij isji ji!
      </Text>
      <Button
        backgroundColor='#03a9f4'
        icon={{ name: 'code' }}
        title='View Now!'
      />
    </Card>
  )

  _renderNoMoreCards = () => (
    <Card title='All done!'>
      <Text style={styles.cardText}>
        No more cards
      </Text>
      <Button
        backgroundColor='#03a9f4'
        title='Get more!'
      />
    </Card>
  )

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={DATA}
          renderCard={this._renderCard}
          renderNoMoreCards={this._renderNoMoreCards}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardText: {
    marginBottom: 12,
  },

  container: {
    backgroundColor: '#fff',
    flex           : 1,
    paddingTop     : 48,
  },
})
