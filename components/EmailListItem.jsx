// components/EmailListItem.js

import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const EmailListItem = ({ email, onDelete }) => {
  const handleDelete = () => {
    onDelete(email._id);
  };

  return (
    <ListItem>
      <ListItemText primary={email.address} />
     
        <IconButton  aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
   
    </ListItem>
  );
};

export default EmailListItem;
