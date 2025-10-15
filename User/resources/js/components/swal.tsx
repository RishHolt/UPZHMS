import Swal from 'sweetalert2';

interface SwalOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

const defaultOptions: SwalOptions = {
  confirmButtonText: 'OK',
  timer: 0,
  timerProgressBar: false,
};

export const showSuccess = (message: string, title?: string) => {
  return Swal.fire({
    ...defaultOptions,
    title: title || 'Success!',
    text: message,
    icon: 'success',
  });
};

export const showError = (message: string, title?: string) => {
  return Swal.fire({
    ...defaultOptions,
    title: title || 'Error!',
    text: message,
    icon: 'error',
  });
};

export const showWarning = (message: string, title?: string) => {
  return Swal.fire({
    ...defaultOptions,
    title: title || 'Warning!',
    text: message,
    icon: 'warning',
  });
};

export const showInfo = (message: string, title?: string) => {
  return Swal.fire({
    ...defaultOptions,
    title: title || 'Info',
    text: message,
    icon: 'info',
  });
};

export const showConfirm = (
  message: string,
  title?: string,
  confirmText?: string,
  cancelText?: string
) => {
  return Swal.fire({
    ...defaultOptions,
    title: title || 'Confirm',
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText || 'Yes',
    cancelButtonText: cancelText || 'No',
  });
};

export const showLoading = (message: string = 'Loading...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

export default Swal;
