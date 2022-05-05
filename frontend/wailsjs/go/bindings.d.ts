export interface go {
  "manager": {
    "Manager": {
		AddContact(arg1:string,arg2:string,arg3:string,arg4:string):Promise<Error>
		Client():Promise<Client|Error>
		CopyToClipboard(arg1:string):Promise<Error>
		CreateContainer(arg1:string,arg2:string,arg3:boolean):Promise<Error>
		DeleteContact(arg1:string):Promise<Error>
		DeleteContainer(arg1:string):Promise<Array<Element>|Error>
		DeleteObject(arg1:string,arg2:string):Promise<Array<Element>|Error>
		Download(arg1:string,arg2:string,arg3:string):Promise<Error>
		ForceSync():Promise<void>
		Get(arg1:string,arg2:string,arg3:number,arg4:Writer):Promise<Array<number>|Error>
		GetAccountInformation():Promise<Account|Error>
		GetObjectMetaData(arg1:string,arg2:string):Promise<Object|Error>
		GetVersion():Promise<string>
		ListContainerIDs():Promise<Array<string>|Error>
		ListContainerObjects(arg1:string,arg2:boolean):Promise<Array<Element>|Error>
		ListContainers(arg1:boolean):Promise<Array<Element>|Error>
		LoadWallet(arg1:string):Promise<Error>
		LoadWalletWithPath(arg1:string,arg2:string):Promise<Error>
		MakeNotification(arg1:UXMessage):Promise<void>
		MakeToast(arg1:UXMessage):Promise<void>
		NewListReadOnlyContainerContents(arg1:number):Promise<Array<Element>|Error>
		NewWallet(arg1:string):Promise<Error>
		OpenInDefaultBrowser(arg1:string):Promise<Error>
		RecentWallets():Promise<any|Error>
		RestrictContainer(arg1:string,arg2:string):Promise<Error>
		RetrieveContactByWalletAddress(arg1:string):Promise<contact|Error>
		RetrieveContacts():Promise<Array<contact>|Error>
		SendSignal(arg1:string,arg2:number):Promise<void>
		SetProgressPercentage(arg1:ProgressMessage):Promise<void>
		SetWalletDebugging(arg1:string,arg2:string):Promise<Error>
		TopUpNeoWallet(arg1:number):Promise<string|Error>
		TransferToken(arg1:string,arg2:number):Promise<string|Error>
		UnlockWallet():Promise<Error>
		Upload(arg1:string,arg2:any):Promise<Array<Element>|Error>
		UploadObject(arg1:string,arg2:string,arg3:number,arg4:any,arg5:Reader):Promise<Array<Element>|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
