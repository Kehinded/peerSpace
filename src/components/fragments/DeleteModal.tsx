
import React from "react";
import "../../styles/fragment/DeleetModal.css";
import { RazorButton, RazorModal } from "@kehinded/razor-ui";

interface MyComponentProps {
  visible?: boolean;
  text?: string;
  title?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  deleteText?: string;
  buttonColor?: string;
  secondText?: string;
  btnClassName?: string;
}

const DeleteModal: React.FC<MyComponentProps> = ({
  visible,
  text,
  title,
  onCancel,
  onDelete,
  loading,
  deleteText,
  buttonColor,
  secondText,
  btnClassName,
}) => {
  return (
    <RazorModal
      className={`delete-modal-reuse-wrap`}
      visble={visible}
      effect={`fadeInRight`}
      onBtnClick={() => {}}
      // outerClose
      onClose={onCancel}
    >
      <div className="container-wrap">
        <p className="title">{title || "Delete Link"}</p>
        <p className="text g">
          {text ||
            "Remove this beneficiaries, from your beneficiaries list, this mean you won’t be able to perform transaction, "}
        </p>
      </div>
      <div className="two-button-wrap">
        <p onClick={onCancel} className="cancel">
          {secondText || "Cancel"}
        </p>
        <RazorButton
          color={buttonColor || (`error-light` as any)}
          label={deleteText || "Delete"}
          loading={loading}
          size={`small`}
          onClick={onDelete}
          className={btnClassName}
        />
      </div>
    </RazorModal>
  );
};

export default DeleteModal;
