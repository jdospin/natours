/*eslint-disable*/
export function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

// type is 'success' or 'error'
export function showAlert(type, msg, time = 7){
  hideAlert();
  const html = document.createElement('div');
  html.className = `alert alert--${type}`;
  html.innerHTML = msg;
  document.querySelector('body').insertAdjacentElement('afterbegin', html);
  window.setTimeout(() => hideAlert(), time * 1000);
}
