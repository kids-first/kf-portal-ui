const useQueryParams = () => {
  return new URLSearchParams(window.location.search);
};

export default useQueryParams;