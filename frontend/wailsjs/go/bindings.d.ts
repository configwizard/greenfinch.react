import * as models from './models';

export interface go {
  "manager": {
    "Manager": {
		AddContact(arg1:string,arg2:string,arg3:string,arg4:string):Promise<Error>
		Client():Promise<models.Client|Error>
		CopyToClipboard(arg1:string):Promise<Error>
		CreateContainer(arg1:string,arg2:string,arg3:boolean):Promise<Error>
		DeleteContact(arg1:string):Promise<Error>
		DeleteContainer(arg1:string):Promise<Array<models.Element>|Error>
		DeleteObject(arg1:string,arg2:string):Promise<Array<models.Element>|Error>
		Download(arg1:string,arg2:string,arg3:string):Promise<Error>
		ForceSync():Promise<void>
		Get(arg1:string,arg2:string,arg3:number,arg4:models.Writer):Promise<Array<number>|Error>
		GetAccountInformation():Promise<models.Account|Error>
		GetObjectMetaData(arg1:string,arg2:string):Promise<models.Object|Error>
		GetVersion():Promise<string>
		ListContainerIDs():Promise<Array<string>|Error>
		ListContainerObjects(arg1:string,arg2:boolean):Promise<Array<models.Element>|Error>
		ListContainers(arg1:boolean):Promise<Array<models.Element>|Error>
		LoadWallet(arg1:string):Promise<Error>
		LoadWalletWithPath(arg1:string,arg2:string):Promise<Error>
		MakeNotification(arg1:models.UXMessage):Promise<void>
		MakeToast(arg1:models.UXMessage):Promise<void>
		NewListReadOnlyContainerContents(arg1:number):Promise<Array<models.Element>|Error>
		NewWallet(arg1:string):Promise<Error>
		OpenInDefaultBrowser(arg1:string):Promise<Error>
		RecentWallets():Promise<any|Error>
		RestrictContainer(arg1:string,arg2:string):Promise<Error>
		RetrieveContactByWalletAddress(arg1:string):Promise<models.contact|Error>
		RetrieveContacts():Promise<Array<models.contact>|Error>
		SendSignal(arg1:string,arg2:number):Promise<void>
		SetProgressPercentage(arg1:models.ProgressMessage):Promise<void>
		SetWalletDebugging(arg1:string,arg2:string):Promise<Error>
		TopUpNeoWallet(arg1:number):Promise<string|Error>
		UnlockWallet():Promise<Error>
		Upload(arg1:string,arg2:any):Promise<Array<models.Element>|Error>
		UploadObject(arg1:string,arg2:string,arg3:number,arg4:any,arg5:models.Reader):Promise<Array<models.Element>|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
