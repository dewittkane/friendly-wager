const mapStoreToProps = (reduxState) => {
  return {
    // reduxState properties bound to "props.store"
    // ---------
    store: reduxState,
  };
};

export default mapStoreToProps;
