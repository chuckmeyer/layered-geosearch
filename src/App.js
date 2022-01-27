import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
} from 'react-instantsearch-dom';
import {
  GoogleMapsLoader,
  GeoSearch,
  Control,
  Marker,
} from 'react-instantsearch-dom-maps';
import { AgencyFinderForm } from './AgencyFinderForm';
import PropTypes from 'prop-types';
import './App.css';
import './Form.css';

const indexName = process.env.REACT_APP_ALGOLIA_INDEX_NAME;
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
);

function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">Find an Agency</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <div className="form-box">
          <AgencyFinderForm />
        </div>

        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <div className="search-panel">
            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />

              <div style={{ height: 500 }}>
                <GoogleMapsLoader apiKey={googleApiKey}>
                  {google => (
                    <GeoSearch google={google}>
                      {({ hits }) => (
                        <div>
                          <Control />
                          {hits.map(hit => (
                            <Marker key={hit.objectID} hit={hit} />
                          ))}
                        </div>
                      )}
                    </GeoSearch>
                  )}
                </GoogleMapsLoader>
              </div>

              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <Highlight attribute="address" hit={props.hit} /><br />
        <Highlight attribute="city" hit={props.hit} />, <Highlight attribute="state" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
