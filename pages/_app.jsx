// _app.js

import React from 'react';
import App from 'next/app';
import Layout from '../components/layout';
import '../styles/globals.css';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../utils/msalConfig';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <MsalProvider instance={msalInstance}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MsalProvider>
    );
  }
}

export default MyApp;
