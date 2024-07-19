// components/EmailListItem.js

import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
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
