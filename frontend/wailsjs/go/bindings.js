// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
const go = {
  "manager": {
    "Manager": {
      /**
       * AddContact
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {string} arg3 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "AddContact": (arg1, arg2, arg3) => {
        return window.go.manager.Manager.AddContact(arg1, arg2, arg3);
      },
      /**
       * Client
       * @returns {Promise<Client|Error>}  - Go Type: *client.Client
       */
      "Client": () => {
        return window.go.manager.Manager.Client();
      },
      /**
       * CreateContainer
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {boolean} arg3 - Go Type: bool
       * @returns {Promise<Error>}  - Go Type: error
       */
      "CreateContainer": (arg1, arg2, arg3) => {
        return window.go.manager.Manager.CreateContainer(arg1, arg2, arg3);
      },
      /**
       * DeleteContact
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "DeleteContact": (arg1) => {
        return window.go.manager.Manager.DeleteContact(arg1);
      },
      /**
       * DeleteContainer
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "DeleteContainer": (arg1) => {
        return window.go.manager.Manager.DeleteContainer(arg1);
      },
      /**
       * DeleteObject
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
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
       * ForceSync
       * @returns {Promise<void>} 
       */
      "ForceSync": () => {
        return window.go.manager.Manager.ForceSync();
      },
      /**
       * Get
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {number} arg3 - Go Type: int
       * @param {Writer} arg4 - Go Type: *io.Writer
       * @returns {Promise<Array<number>|Error>}  - Go Type: []uint8
       */
      "Get": (arg1, arg2, arg3, arg4) => {
        return window.go.manager.Manager.Get(arg1, arg2, arg3, arg4);
      },
      /**
       * GetAccountInformation
       * @returns {Promise<Account|Error>}  - Go Type: manager.Account
       */
      "GetAccountInformation": () => {
        return window.go.manager.Manager.GetAccountInformation();
      },
      /**
       * GetObjectMetaData
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Object|Error>}  - Go Type: *object.Object
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
       * ListContainerObjects
       * @param {string} arg1 - Go Type: string
       * @param {boolean} arg2 - Go Type: bool
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "ListContainerObjects": (arg1, arg2) => {
        return window.go.manager.Manager.ListContainerObjects(arg1, arg2);
      },
      /**
       * ListContainers
       * @param {boolean} arg1 - Go Type: bool
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "ListContainers": (arg1) => {
        return window.go.manager.Manager.ListContainers(arg1);
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
       * MakeNotification
       * @param {UXMessage} arg1 - Go Type: manager.UXMessage
       * @returns {Promise<void>} 
       */
      "MakeNotification": (arg1) => {
        return window.go.manager.Manager.MakeNotification(arg1);
      },
      /**
       * MakeToast
       * @param {UXMessage} arg1 - Go Type: manager.UXMessage
       * @returns {Promise<void>} 
       */
      "MakeToast": (arg1) => {
        return window.go.manager.Manager.MakeToast(arg1);
      },
      /**
       * NewListReadOnlyContainerContents
       * @param {number} arg1 - Go Type: int64
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "NewListReadOnlyContainerContents": (arg1) => {
        return window.go.manager.Manager.NewListReadOnlyContainerContents(arg1);
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
       * RecentWallets
       * @returns {Promise<any|Error>}  - Go Type: map[string]string
       */
      "RecentWallets": () => {
        return window.go.manager.Manager.RecentWallets();
      },
      /**
       * RestrictContainer
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "RestrictContainer": (arg1, arg2) => {
        return window.go.manager.Manager.RestrictContainer(arg1, arg2);
      },
      /**
       * RetrieveContactByWalletAddress
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<contact|Error>}  - Go Type: manager.contact
       */
      "RetrieveContactByWalletAddress": (arg1) => {
        return window.go.manager.Manager.RetrieveContactByWalletAddress(arg1);
      },
      /**
       * RetrieveContacts
       * @returns {Promise<Array<contact>|Error>}  - Go Type: []manager.contact
       */
      "RetrieveContacts": () => {
        return window.go.manager.Manager.RetrieveContacts();
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
       * SetWalletDebugging
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @returns {Promise<Error>}  - Go Type: error
       */
      "SetWalletDebugging": (arg1, arg2) => {
        return window.go.manager.Manager.SetWalletDebugging(arg1, arg2);
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
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UnlockWallet": () => {
        return window.go.manager.Manager.UnlockWallet();
      },
      /**
       * Upload
       * @param {string} arg1 - Go Type: string
       * @param {any} arg2 - Go Type: map[string]string
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "Upload": (arg1, arg2) => {
        return window.go.manager.Manager.Upload(arg1, arg2);
      },
      /**
       * UploadObject
       * @param {string} arg1 - Go Type: string
       * @param {string} arg2 - Go Type: string
       * @param {number} arg3 - Go Type: int
       * @param {any} arg4 - Go Type: map[string]string
       * @param {Reader} arg5 - Go Type: *io.Reader
       * @returns {Promise<Array<Element>|Error>}  - Go Type: []filesystem.Element
       */
      "UploadObject": (arg1, arg2, arg3, arg4, arg5) => {
        return window.go.manager.Manager.UploadObject(arg1, arg2, arg3, arg4, arg5);
      },
    },
  },

};
export default go;
