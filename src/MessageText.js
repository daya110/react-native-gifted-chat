import PropTypes from 'prop-types';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  onUrlPress(url) {
    if (url.match(WWW_URL_PATTERN)) {
      this.onUrlPress('http://' + url);
    } else if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }

  onPhonePress(phone) {
    const options = [
      'Text',
      'Call',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
      }
    });
  }

  onEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <ParsedText
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}
          parse={[
            {type: 'url', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onUrlPress},
            {type: 'phone', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onPhonePress},
            {type: 'email', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onEmailPress},
          ]}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func,
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
};

MessageText.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
