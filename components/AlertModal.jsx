import React from 'react';
import { Modal, Fade, Backdrop } from '@mui/material';
import AlertForm from './AlertForm';

const AlertModal = ({ open, handleClose, clients, newAlert, setNewAlert, handleSave }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div>
          <AlertForm clients={clients} newAlert={newAlert} setNewAlert={setNewAlert} handleSave={handleSave} />
        </div>
      </Fade>
    </Modal>
  );
};

export default AlertModal;
