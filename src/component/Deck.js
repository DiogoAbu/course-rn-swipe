import React from 'react'
import { Animated, Dimensions, LayoutAnimation, PanResponder, StyleSheet, UIManager, View } from 'react-native'

const SCREENWIDTH = Dimensions.get('window').width
const SWIPETRESHOLD = 0.25 * SCREENWIDTH
const SWIPEOUTDURATION = 250

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

export default class Deck extends React.PureComponent {
  static defaultProps = {
    onSwipeLeft : () => null,
    onSwipeRight: () => null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return { activeCardIndex: 0 }
    }
    
    return null
  }

  constructor(props) {
    super(props)

    this._position = new Animated.ValueXY()

    const panResponder = PanResponder.create({
      onPanResponderMove          : Animated.event([ null, { dx: this._position.x, dy: this._position.y } ]),
      onPanResponderRelease       : this._onReleasedCard,
      onStartShouldSetPanResponder: () => true,
    })

    this.state = {
      activeCardIndex: 0,
      data           : [],
      panResponder,
    }
  }

  componentDidMount() {
    this.setState({ data: this.props.data })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.setState({ activeCardIndex: 0 })
    }
  }

  _onReleasedCard = (event, gesture) => {
    if (gesture.dx < -SWIPETRESHOLD) {
      return this._forceSwipe('left')
    }
    if (gesture.dx > SWIPETRESHOLD) {
      return this._forceSwipe('right')
    }
    
    return Animated.timing(this._position, { toValue: 0 }).start()
  }

  _forceSwipe = direction => {
    const x = direction === 'left' ? -SCREENWIDTH : SCREENWIDTH
    Animated
      .timing(this._position, { duration: SWIPEOUTDURATION, toValue: { x: x * 1.2, y: 0 } })
      .start(() => this._onSwipeDone(direction))
  }

  _onSwipeDone = direction => {
    const { onSwipeLeft, onSwipeRight, data } = this.props
    const item = data[this.state.activeCardIndex]

    direction === 'left' ? onSwipeLeft(item) : onSwipeRight(item)

    this._position.setValue({ x: 0, y: 0 })

    LayoutAnimation.spring()
    this.setState({ activeCardIndex: this.state.activeCardIndex + 1 })
  }

  _getCardStyle = () => {
    const rotate = this._position.x.interpolate({
      inputRange : [ -SCREENWIDTH, 0, SCREENWIDTH ],
      outputRange: [ '-60deg', '0deg', '60deg' ],
    })

    return {
      transform: [ { rotate } ],
    }
  }

  _renderCards = () => {
    const { data, renderNoMoreCards, renderCard } = this.props
    const { activeCardIndex, panResponder } = this.state

    if (activeCardIndex >= data.length){
      return renderNoMoreCards()
    }
    
    return data.map((item, index) => {
      const renderedCard = renderCard({ item })

      if (index < activeCardIndex){
        return null
      }

      if (index === activeCardIndex){
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[ this._position.getLayout(), this._getCardStyle(), styles.card, { zIndex: index * -1 } ]}
          >
            {renderedCard}
          </Animated.View>
        )
      }
    
      return (
        <Animated.View
          key={item.id}
          style={[ styles.card, { top: 10 * (index - activeCardIndex), zIndex: index * -1 } ]}
        >
          {renderedCard}
        </Animated.View>
      )
    })
  }

  render() {
    return (
      <View>{this._renderCards()}</View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    position : 'absolute',
    width    : SCREENWIDTH,
  },
})