import React, { Component } from 'react';
import autoBind from 'react-autobind';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/index.css';
import { fetchDictionaries, searchDictionaries } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { clearDictionaries } from '../../../redux/actions/dictionaries/dictionaryActions';
import SideBar from '../components/SideNavigation';
import ListDictionaries from '../components/dictionary/ListDictionaries';
import SearchDictionaries from '../components/dictionary/DictionariesSearch';
import UserDashboard from '../components/dictionary/user/UserDashboard';
import AddDictionary from '../components/dictionary/AddDictionary';

export class DictionaryDisplay extends Component {
  static propTypes = {
    fetchDictionaries: propTypes.func.isRequired,
    dictionaries: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    isFetching: propTypes.bool.isRequired,
    searchDictionaries: propTypes.func.isRequired,
    clearDictionaries: propTypes.func.isRequired,
    organizations: propTypes.arrayOf.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      dictionaryViewOptions: 'user',
      show: false,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchDictionaries();
  }

  onSubmit(event) {
    event.preventDefault();
    const { user } = this.state;
    if (user) {
      this.setState({ dictionaryViewOptions: 'user' });
    } else {
      this.setState({ dictionaryViewOptions: 'organizations' });
    }
    this.props.clearDictionaries();
    this.props.searchDictionaries(this.state.searchInput);
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue });
    if (name === 'searchInput' && value.length <= 0) {
      this.props.clearDictionaries();
      this.props.fetchDictionaries(value);
    }
  }

  handleHide = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    const { dictionaries, isFetching, organizations } = this.props;
    const { searchInput, dictionaryViewOptions } = this.state;
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <UserDashboard
          dictionaries={dictionaries}
          organizations={organizations}
          viewState={dictionaryViewOptions}
        />
        <div className="dashboard-head">
          <div className="btn add-dictionaries" onClick={this.handleShow}>
              Add Dictionary
          </div>
          <SearchDictionaries
            onSearch={this.onSearch}
            onSubmit={this.onSubmit}
            searchValue={searchInput}
            fetching={isFetching}
          />
          <div className="row justify-content-center">
            <div className="offset-sm-1 col-10">
              <ListDictionaries
                dictionaries={dictionaries}
                fetching={isFetching}
                dictionaryViewOptions={dictionaryViewOptions}
              />
            </div>
          </div>
        </div>
        <AddDictionary show={this.state.show} handleHide={this.handleHide} />
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  dictionaries: state.dictionaries.dictionaries,
  isFetching: state.dictionaries.loading,
  dictionary: state.dictionaries.dictionary,
  organizations: state.organizations.organizations,
});
export default connect(mapStateToProps, {
  fetchDictionaries,
  searchDictionaries,
  clearDictionaries,
})(DictionaryDisplay);