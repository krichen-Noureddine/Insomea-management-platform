// This could be in any part of your application that executes in your development environment
import { getPowerBiAccessToken } from './config';

// Call the function on app startup or file load
getPowerBiAccessToken()
    .then(token => {
        console.log('Access Token:', token);
    })
    .catch(error => {
        console.error('Failed to get token:', error);
    });
