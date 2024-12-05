import { msalConfig } from './msalConfig';
import { useState, useEffect } from 'react';
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from '@azure/msal-react';

const useAuthentication = () => {
  const { instance, accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userProfiles, setUserProfiles] = useState(null); // State to hold user profiles
  const [appRoles, setAppRoles] = useState(null);
  const [servicePrincipalRoles, setServicePrincipalRoles] = useState(null);
  const [enrichedAssignments, setEnrichedAssignments] = useState(null);
  const allowedRoles = [
    "37989c24-be1d-4573-aa51-d59094cdfb62", // Replace with your allowed appRoleId(s)
    "6c800343-9efa-4e21-bdce-91789e4533d8",
  ];

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
    const accessTokenRequest = {
      scopes: [
        'User.Read.All',
        'https://graph.microsoft.com/AppRoleAssignment.ReadWrite.All',
        'Application.Read.All',
      ],
      account: accounts[0],
    };

    try {
      const response = await instance.acquireTokenSilent(accessTokenRequest);
      setAccessToken(response.accessToken);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const interactiveResponse = await instance.acquireTokenPopup(accessTokenRequest);
          setAccessToken(interactiveResponse.accessToken);
        } catch (interactiveError) {
          console.error('Failed to acquire token interactively:', interactiveError);
        }
      }
    }
  };
  const enrichAssignments = async (users) => {
    try {
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          // Fetch roles assigned to this specific user
          const roles = await fetchAssignedRoles(user.id);
          
          if (roles.length > 0) { // Only enrich users with roles
            const enrichedRoles = await Promise.all(
              roles.map(async (assignment) => {
                // Fetch role details from Microsoft Graph
                const roleDetails = await fetch(
                  `https://graph.microsoft.com/v1.0/servicePrincipals/${assignment.resourceId}/appRoles`,
                  {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                    },
                  }
                );
                if (!roleDetails.ok) {
                  throw new Error('Failed to fetch role details');
                }
                const roleData = await roleDetails.json();
                const matchingRole = roleData.value.find(
                  (role) => role.id === assignment.appRoleId
                );
                return { ...assignment, roleInfo: matchingRole };
              })
            );
            return { ...user, roles: enrichedRoles };
          }
          return null; // Return null if no roles found
        })
      );
      
      // Filter out null values (users without roles)
      const filteredEnrichedUsers = enrichedUsers.filter(user => user !== null);
      
      // Set the enriched users with roles in the state
      setEnrichedAssignments(filteredEnrichedUsers);
      console.log('Enriched Users with Roles:', filteredEnrichedUsers); // Log users with their roles
    } catch (error) {
      console.error('Error enriching assignments:', error);
    }
  };
  
  
  
  const fetchAssignedRoles = async (userId) => {
    try {
      const url = `https://graph.microsoft.com/v1.0/users/${userId}/appRoleAssignments`; // Change to user-specific roles
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch assigned roles');
      }
  
      const data = await response.json();
      return data.value; // List of roles assigned to the user
    } catch (error) {
      console.error('Error fetching assigned roles:', error);
      return [];
    }
  };
  
  const fetchAllUsers = async () => {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data.value; // List of all users
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  };

  const checkUserAuthorization = async () => {
    if (!accessToken) return;
  
    try {
      const allUsers = await fetchAllUsers();
      await enrichAssignments(allUsers);
  
      const roles = await fetchAssignedRoles(account.localAccountId); // Ensure to check roles for the current user
      setUserRoles(roles.map((role) => role.appRoleId));
  
      const hasValidRole = roles.some((role) => allowedRoles.includes(role.appRoleId));
      setIsAuthorized(hasValidRole);
  
      if (!hasValidRole) {
        console.warn('User is not authorized. Logging out.');
        handleLogout();
      }
    } catch (error) {
      console.error('Authorization check failed:', error);
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
  useEffect(() => {
    if (isAuthenticated) {
      getAccessToken();
    }
  }, [isAuthenticated]);


  

 
  useEffect(() => {
    if (accessToken) {
      checkUserAuthorization();
      getAllUserProfiles();

    }
  }, [accessToken]);

  return {
    isAuthenticated,
    account,
    accessToken,
    userRoles,
    isAuthorized,
    enrichedAssignments,
    getAllUserProfiles,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuthentication;
