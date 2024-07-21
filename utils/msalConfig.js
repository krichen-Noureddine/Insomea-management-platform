import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "e481b771-1e6c-4d3f-b8e4-ab39987c87d7",
    authority: "https://login.microsoftonline.com/87369448-76ea-4c62-a43a-1fc6db220b04",
    redirectUri: "http://localhost:3000/",
    scopes: ['openid', 'profile', 'User.Read']
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          // case LogLevel.Error:
          //   console.error(message);
          //   return;
          // case LogLevel.Info:
          //   console.info(message);
          //   return;
          // case LogLevel.Verbose:
          //   console.debug(message);
          //   return;
          // case LogLevel.Warning:
          //   console.warn(message);
          //   return;
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);