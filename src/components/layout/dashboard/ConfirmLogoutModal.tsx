import  { useContext, useState } from "react";
import DeleteModal from "../../fragments/DeleteModal";
import ActionContext from "../../../context/ActionContext";

// interface MyComponentProps {
//   visible?: boolean;
//   onCancel?: () => void;
// }

const ConfirmLogoutModal = () => {
  const [logoutload, setLogOutLoad] = useState(false);
  const actionCtx = useContext(ActionContext);

  const handleLogout = async () => {
    setLogOutLoad(true);
    setTimeout(() => {
      localStorage?.clear();
      window?.location?.reload();
      setLogOutLoad(false);
    }, 1000);
  };

  return (
    <DeleteModal
      loading={logoutload}
      onDelete={handleLogout}
      visible={actionCtx?.logoutModal}
      onCancel={() => {
        actionCtx?.setLogoutModal(false);
      }}
      title={`Want to Logout ?`}
      deleteText={`Yes, logout`}
      buttonColor="error-light"
      text={`Are you sure you want to log out? Please confirm by clicking "Yes, logout" or "Cancel".`}
      btnClassName={`logout-btn-classmaen`}
    />
  );
};

export default ConfirmLogoutModal;
