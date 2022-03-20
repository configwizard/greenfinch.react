// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
const go = {
  "manager": {
    "Manager": {
      /**
       * Client
       * @returns {Promise<Client>}  - Go Type: *client.Client
       */
      "Client": () => {
        return window.go.manager.Manager.Client();
      },
      /**
       * CreateContainer
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "CreateContainer": (arg1) => {
        return window.go.manager.Manager.CreateContainer(arg1);
      },
      /**
       * Delete
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "Delete": (arg1, arg2) => {
        return window.go.manager.Manager.Delete(arg1, arg2);
      },
      /**
       * DeleteContainer
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "DeleteContainer": (arg1) => {
        return window.go.manager.Manager.DeleteContainer(arg1);
      },
      /**
       * DeleteObject
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "DeleteObject": (arg1, arg2) => {
        return window.go.manager.Manager.DeleteObject(arg1, arg2);
      },
      /**
       * Download
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {string} arg3 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "Download": (arg1, arg2, arg3) => {
        return window.go.manager.Manager.Download(arg1, arg2, arg3);
      },
      /**
       * Get
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {Writer} arg3 - Go Type: *io.Writer
       * @returns {Promise<Array<number>|Error>}  - Go Type: []uint8
       */
      "Get": (arg1, arg2, arg3) => {
        return window.go.manager.Manager.Get(arg1, arg2, arg3);
      },
      /**
       * GetAccountInformation
       * @returns {Promise<Account|Error>}  - Go Type: manager.Account
       */
      "GetAccountInformation": () => {
        return window.go.manager.Manager.GetAccountInformation();
      },
      /**
       * GetContainer
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Container|Error>}  - Go Type: *container.Container
       */
      "GetContainer": (arg1) => {
        return window.go.manager.Manager.GetContainer(arg1);
      },
      /**
       * GetObjectMetaData
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<ObjectHeadRes|Error>}  - Go Type: *client.ObjectHeadRes
       */
      "GetObjectMetaData": (arg1, arg2) => {
        return window.go.manager.Manager.GetObjectMetaData(arg1, arg2);
      },
      /**
       * ListContainerIDs
       * @returns {Promise<Array<string>|Error>}  - Go Type: []string
       */
      "ListContainerIDs": () => {
        return window.go.manager.Manager.ListContainerIDs();
      },
      /**
       * ListContainerObjectIDs
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Array<string>|Error>}  - Go Type: []string
       */
      "ListContainerObjectIDs": (arg1) => {
        return window.go.manager.Manager.ListContainerObjectIDs(arg1);
      },
      /**
       * ListContainerPopulatedObjects
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "ListContainerPopulatedObjects": (arg1) => {
        return window.go.manager.Manager.ListContainerPopulatedObjects(arg1);
      },
      /**
       * ListContainers
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "ListContainers": () => {
        return window.go.manager.Manager.ListContainers();
      },
      /**
       * ListContainersAsync
       * @returns {Promise<Error>}  - Go Type: error
       */
      "ListContainersAsync": () => {
        return window.go.manager.Manager.ListContainersAsync();
      },
      /**
       * ListObjectsAsync
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "ListObjectsAsync": (arg1) => {
        return window.go.manager.Manager.ListObjectsAsync(arg1);
      },
      /**
       * LoadWallet
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "LoadWallet": (arg1) => {
        return window.go.manager.Manager.LoadWallet(arg1);
      },
      /**
       * MakeToast
       * @param {ToastMessage} arg1 - Go Type: manager.ToastMessage
       * @returns {Promise<void>} 
       */
      "MakeToast": (arg1) => {
        return window.go.manager.Manager.MakeToast(arg1);
      },
      /**
       * NewWallet
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "NewWallet": (arg1) => {
        return window.go.manager.Manager.NewWallet(arg1);
      },
      /**
       * RetrieveContainerFileSystem
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Element|Error>}  - Go Type: filesystem.Element
       */
      "RetrieveContainerFileSystem": (arg1) => {
        return window.go.manager.Manager.RetrieveContainerFileSystem(arg1);
      },
      /**
       * RetrieveFileSystem
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "RetrieveFileSystem": () => {
        return window.go.manager.Manager.RetrieveFileSystem();
      },
      /**
       * Search
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "Search": (arg1) => {
        return window.go.manager.Manager.Search(arg1);
      },
      /**
       * SendSignal
       * @param {string} arg1 - Go Type: string
       * @param {number} arg2 - Go Type: interface {}
       * @returns {Promise<void>} 
       */
      "SendSignal": (arg1, arg2) => {
        return window.go.manager.Manager.SendSignal(arg1, arg2);
      },
      /**
       * SetProgressPercentage
       * @param {ProgressMessage} arg1 - Go Type: manager.ProgressMessage
       * @returns {Promise<void>} 
       */
      "SetProgressPercentage": (arg1) => {
        return window.go.manager.Manager.SetProgressPercentage(arg1);
      },
      /**
       * TopUpNeoWallet
       * @param {number} arg1 - Go Type: float64
       * @returns {Promise<string|Error>}  - Go Type: string
       */
      "TopUpNeoWallet": (arg1) => {
        return window.go.manager.Manager.TopUpNeoWallet(arg1);
      },
      /**
       * UnlockWallet
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UnlockWallet": (arg1) => {
        return window.go.manager.Manager.UnlockWallet(arg1);
      },
      /**
       * Upload
       * @param {string} arg1 - Go Type: string
       * @param {any} arg2 - Go Type: map[string]string
       * @returns {Promise<string|Error>}  - Go Type: string
       */
      "Upload": (arg1, arg2) => {
        return window.go.manager.Manager.Upload(arg1, arg2);
      },
      /**
       * UploadObject
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {any} arg3 - Go Type: map[string]string
       * @param {Reader} arg4 - Go Type: *io.Reader
       * @returns {Promise<string|Error>}  - Go Type: string
       */
      "UploadObject": (arg1, arg2, arg3, arg4) => {
        return window.go.manager.Manager.UploadObject(arg1, arg2, arg3, arg4);
      },
    },
  },

};
export default go;
