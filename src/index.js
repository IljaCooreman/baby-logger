import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

import Today from './components/Today'

import 'tachyons'
import './index.css'
import { BACKEND_ENDPOINT } from './constants/variables';
import Register from './components/Register';

// const client = new ApolloClient({ uri: 'http://localhost:4000' })
const client = new ApolloClient({ uri: BACKEND_ENDPOINT })

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Fragment>
        <nav className="pa3 pa4-ns">
          <Link
            className="link dim white b f6 f5-ns dib mr3"
            to="/"
            title="Feed"
          >
            Registreer
          </Link>
          <NavLink
            className="link dim f6 f5-ns dib mr3 white"
            activeClassName="gray"
            exact={true}
            to="/history"
            title="Feed"
          >
            Overzicht
          </NavLink>
        </nav>
        <div className="fl w-100 pl4 pr4">
          <Switch>
            <Route exact path="/" component={Register} />
            <Route path="/history" component={Today} />
            {/* <Route path="/event-register" component={Register} /> */}
          </Switch>
        </div>
      </Fragment>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
