import uuid from 'uuid/v4';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Select from 'react-select';
import PropTypes from 'prop-types';
import locale, { findLocale } from '../../dashboard/components/dictionary/common/Languages';

class ConceptNameRows extends Component {
  static propTypes = {
    newRow: PropTypes.object,
    nameRows: PropTypes.array,
    index: PropTypes.number,
    addDataFromRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    removeDataFromRow: PropTypes.func.isRequired,
    pathName: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    existingConcept: PropTypes.object,
    rowId: PropTypes.string,
  };

  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    newRow: {
      id: '',
      name: '',
      locale: '',
      locale_full: {},
      locale_preferred: true,
      name_type: '',
    },
    index: 0,
    nameRows: [],
    rowId: '',
  };

  constructor(props) {
    super(props);
    const defaultLocale = findLocale(props.pathName.language);
    const { rowId } = this.props;
    this.state = {
      id: rowId,
      name: '',
      locale: defaultLocale.value,
      locale_full: defaultLocale,
      locale_preferred: true,
      name_type: 'Fully Specified',
    };
    autoBind(this);
  }

  componentDidMount() {
    if (this.props.existingConcept) {
      this.updateState();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.sendToTopComponent();
    }
  }

  updateState() {
    const { newRow, pathName } = this.props;
    const defaultLocale = findLocale(newRow.locale || pathName.language);
    this.setState({
      ...this.state,
      uuid: newRow.uuid || '',
      name: newRow.name || '',
      locale: defaultLocale.value,
      locale_full: defaultLocale,
      name_type: newRow.name_type,
      locale_preferred: !!newRow.locale_preferred,
      external_id: newRow.external_id || uuid(),
    });
  }

  handleChange(event) {
    const {
      target: { name },
    } = event;
    let {
      target: { value },
    } = event;

    if (name === 'locale_preferred') value = value === 'Yes';
    else if (name === 'name_type') value = value === 'null' ? null : value;

    this.setState(() => ({ [name]: value }));
    this.sendToTopComponent();
  }

  handleNameLocale(selectedOptions) {
    this.setState({
      locale: selectedOptions.value,
      locale_full: selectedOptions,
    }, () => {
    });
    this.sendToTopComponent();
  }

  sendToTopComponent() {
    this.props.addDataFromRow(this.state);
  }

  handleRemove(event, id) {
    const {
      removeRow,
      removeDataFromRow,
    } = this.props;
    removeRow(event, id);
    removeDataFromRow({ uuid: id }, 'names');
  }

  render() {
    const { rowId } = this.props;
    return (
      <tr>
        <td>
          <input
            type="text"
            className="form-control"
            onChange={this.handleChange}
            placeholder="eg. Malaria"
            name="name"
            value={this.state.name}
            id="concept-name"
            required
          />
        </td>
        <td>
          <select
            id="type"
            name="name_type"
            value={this.state.name_type === null ? 'null' : this.state.name_type}
            className="custom-select"
            onChange={this.handleChange}
            required
          >
            <option />
            <option value="Fully Specified">Fully Specified</option>
            <option value="null">Synonym</option>
            <option value="Short">Short</option>
            <option value="Index Term">Index Term</option>
          </select>
        </td>
        <td className="concept-language">
          <Select
            id="locale_full"
            name="locale_full"
            value={this.state.locale_full}
            onChange={this.handleNameLocale}
            options={locale}
            required
          />
        </td>
        <td>
          <select
            id="locale_preferred"
            name="locale_preferred"
            value={this.state.locale_preferred ? 'Yes' : 'No'}
            className="custom-select"
            onChange={this.handleChange}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </td>
        <td>
          <button
            className="btn btn-outline-danger concept-form-table-link"
            id="remove-name"
            type="button"
            onClick={event => this.handleRemove(event, rowId)}
          >
            remove
          </button>
        </td>
      </tr>
    );
  }
}

export default ConceptNameRows;
