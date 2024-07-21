import { msalConfig } from './msalConfig';
import { useState, useEffect } from 'react';
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from '@azure/msal-react';

const useAuthentication = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userProfiles, setUserProfiles] = useState(null); // State to hold user profiles
  const [appRoles, setAppRoles] = useState(null); // State to hold application roles
  const [servicePrincipalRoles, setServicePrincipalRoles] = useState(null);
const [enrichedAssignments, setEnrichedAssignments] = useState(null);


  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true);
      setAccount(accounts[0]);
    } else {
      setIsAuthenticated(false);
      setAccount(null);
    }
  }, [accounts]);

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(msalConfig.auth);
      if (loginResponse) {
        setIsAuthenticated(true);
        setAccount(loginResponse.account);
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = () => {
    instance.logout();
  };
  const getAccessToken = async () => {
    // Define the accessTokenRequest object outside the try block but inside the function
    // so it's accessible throughout the function scope
    const accessTokenRequest = {
      scopes: ['User.Read.All', 'https://graph.microsoft.com/AppRoleAssignment.ReadWrite.All' ,'Application.Read.All'],
      account: accounts[0], // Ensure accounts[0] is defined or handle potential undefined case
    };

    try {
      const response = await instance.acquireTokenSilent(accessTokenRequest);
      setAccessToken(response.accessToken);
    } catch (error) {
      console.error('Failed to acquire token silently:', error);

      if (error instanceof InteractionRequiredAuthError) {
        try {
          // Here, accessTokenRequest is defined because it's in the same function scope
          const interactiveResponse = await instance.acquireTokenPopup(accessTokenRequest);
          setAccessToken(interactiveResponse.accessToken);
        } catch (interactiveError) {
          console.error('Failed to acquire token interactively:', interactiveError);
        }
      }
    }
  };
  

  const getAllUserProfiles = async () => {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profiles');
      }

      const data = await response.json();
     // console.log('User Profiles:', data);
      setUserProfiles(data);
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
    }
  };

  const fetchServicePrincipalRoles = async () => {
    try {
      const url = `https://graph.microsoft.com/v1.0/servicePrincipals/56b90f31-0d3d-42f6-894b-fff6bd253b38/appRoleAssignedTo`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch service principals');
      }
  
      const data = await response.json();
   // console.log('Service Principal fetched successfully:', data.value);
    return data.value; 
    } catch (error) {
      console.error('Error fetching service principals:', error);
      throw error;
    }
  };
  
  const fetchApplicationAppRoles = async () => {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/applications(appId='e481b771-1e6c-4d3f-b8e4-ab39987c87d7')`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch application app roles');
      }
  
      const data = await response.json();
      return data.appRoles; // This contains the definitions of app roles.
    } catch (error) {
      console.error('Error fetching application app roles:', error);
      throw error;
    }
  };
  function enrichAssignmentsWithRoleInfo(assignments, appRoles) {
  
    return assignments.map(assignment => {
      const roleDetail = appRoles.find(role => role.id === assignment.appRoleId);
      // if (roleDetail) {
      //   //console.log(`Found matching role for appRoleId ${assignment.appRoleId}: ${roleDetail.displayName}`);
      // } else {
      //   //console.log(`No matching role found for appRoleId ${assignment.appRoleId}.`);
      // }
  
      return {
        ...assignment,
        roleName: roleDetail?.displayName || 'Unknown Role',
        roleDescription: roleDetail?.description || 'No description available',
      };
    });
  }
  
  
  useEffect(() => {
    if (isAuthenticated) {
      getAccessToken();
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          // Fetch service principal roles
          const servicePrincipalRoles = await fetchServicePrincipalRoles();
          setServicePrincipalRoles(servicePrincipalRoles);
          // Fetch application app roles
          const applicationAppRoles = await fetchApplicationAppRoles();
          setAppRoles(applicationAppRoles);

          // Enrich assignments
          const enrichedAssignments = enrichAssignmentsWithRoleInfo(servicePrincipalRoles, applicationAppRoles);
          setEnrichedAssignments(enrichedAssignments);
          // Update state or perform additional actions with enriched assignments
        } catch (error) {
          console.error('Error during fetch and enrich process:', error);
        }
      }
    };
  
    fetchData();
  }, [accessToken, isAuthenticated]); // Trigger this effect when accessToken or isAuthenticated changes
  
  useEffect(() => {
    if (accessToken) {
     getAllUserProfiles();
     //getApplicationDetails();
   // getUsersAssignedToAppRoles();
  // fetchServicePrincipalRoles();
  //fetchApplicationAppRoles();
  //enrichAssignmentsWithRoleInfo();
    }
  }, [accessToken]);

  return {
    isAuthenticated,
    account,
    accessToken,
    userProfiles,
    appRoles,
    servicePrincipalRoles,
    enrichedAssignments,
    getAllUserProfiles,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuthentication;
