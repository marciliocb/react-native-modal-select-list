import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  SelectListHeaderContainer,
  SelectListHeaderContent,
  SelectListHeaderCloseButton,
  SelectListHeaderCloseButtonText,
  SelectListHeaderInputContainer,
  SelectListHeaderInput,
  SelectListHeaderInputClearButton,
  SelectListHeaderInputClearButtonText,
} from './SelectListHeader.styles';

const USER_EDITION_WAIT_INTERVAL = 300;

const initialState = {
  text: '',
  onUserEditionEnd: null,
};

class SelectListHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChangeText(text) {
    const { onUserEditionEnd } = this.state;
    // Updates the inputed text into state.
    this.setState({ text });
    // Clear any user edition timer that is already running.
    clearTimeout(onUserEditionEnd);
    this.setState({
      onUserEditionEnd: setTimeout(
        this.handleUserEndedEdition.bind(this),
        USER_EDITION_WAIT_INTERVAL,
      ),
    });
  }

  handleUserEndedEdition() {
    const { text } = this.state;
    const { onHeaderInputChangeText } = this.props;
    onHeaderInputChangeText(text);
  }

  clearText() {
    return this.handleChangeText(initialState.text);
  }

  render() {
    const {
      placeholder,
      disableTextSearch,
      closeButtonText,
      onCloseModalRequest,
    } = this.props;
    const { text } = this.state;
    return (
      <SelectListHeaderContainer>
        <SelectListHeaderContent>
          <SelectListHeaderCloseButton onPress={onCloseModalRequest}>
            <SelectListHeaderCloseButtonText numberOfLines={1}>
              {closeButtonText}
            </SelectListHeaderCloseButtonText>
          </SelectListHeaderCloseButton>
          { !disableTextSearch && (
            <SelectListHeaderInputContainer>
              <SelectListHeaderInput
                placeholder={placeholder}
                value={text}
                onChangeText={(...args) => this.handleChangeText(...args)}
              />
              { !!text && (
                <SelectListHeaderInputClearButton onPress={() => this.clearText()}>
                  <SelectListHeaderInputClearButtonText>x</SelectListHeaderInputClearButtonText>
                </SelectListHeaderInputClearButton>
              )}
            </SelectListHeaderInputContainer>
          )}
        </SelectListHeaderContent>
      </SelectListHeaderContainer>
    );
  }
}

SelectListHeader.defaultProps = {
  placeholder: null,
  closeButtonText: 'Close',
};

SelectListHeader.propTypes = {
  placeholder: PropTypes.string,
  closeButtonText: PropTypes.string,
  onCloseModalRequest: PropTypes.func.isRequired,
  onHeaderInputChangeText: PropTypes.func.isRequired,
  disableTextSearch: PropTypes.bool.isRequired,
};

export default SelectListHeader;
