const setAppSpinner = (isLoading: boolean): void => {
  const loader = document.querySelector('.app-spinner');
  if (!loader) {
    return;
  }
  if (isLoading) {
    loader.classList.remove('loaded');
    return;
  }
  loader.classList.add('loaded');
};

export default {
  setAppSpinner,
}