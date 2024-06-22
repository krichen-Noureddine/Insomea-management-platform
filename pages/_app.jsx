import React from 'react';
import App from 'next/app';
import Layout from '../components/layout';
import '../styles/globals.css';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../utils/msalConfig';
import { NotificationProvider } from '@/components/Notification';
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <MsalProvider instance={msalInstance}>
        <NotificationProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationProvider>
      </MsalProvider>
    );
  }
}

export default MyApp;
