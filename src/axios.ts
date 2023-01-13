export const axiosConfig = () => {
  // Hack for assisted-ui-lib axiosClient.ts, we switched from react-create-app to vite
  // TODO: make it gerenric there by depending on passed parameters from the calling context
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.process = {
    env: {
      REACT_APP_API_ROOT: (import.meta.env.VITE_ASSISTED_SERVICE_API_ROOT ||
        '/api/assisted-install') as string,
    },
  };
};
