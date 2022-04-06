import * as models from './models';

export interface go {
  "manager": {
    "Manager": {
		Client():Promise<models.Client|Error>
		CreateContainer(arg1:string):Promise<Error>
		Delete(arg1:string,arg2:string):Promise<Error>
		DeleteContainer(arg1:string):Promise<Error>
		DeleteObject(arg1:string,arg2:string):Promise<Error>
		Download(arg1:string,arg2:string,arg3:string):Promise<Error>
		Get(arg1:string,arg2:string,arg3:models.Writer):Promise<Array<number>|Error>
		GetAccountInformation():Promise<models.Account|Error>
		GetContainer(arg1:string):Promise<models.Container|Error>
		GetObjectMetaData(arg1:string,arg2:string):Promise<models.ObjectHeadRes|Error>
		ListContainerIDs():Promise<Array<string>|Error>
		ListContainerObjectIDs(arg1:string):Promise<Array<string>|Error>
		ListContainerPopulatedObjects(arg1:string):Promise<Array<models.Element>|Error>
		ListContainers():Promise<Array<models.Element>|Error>
		ListContainersAsync():Promise<Error>
		ListObjectsAsync(arg1:string):Promise<Error>
		LoadWallet(arg1:string):Promise<Error>
		MakeToast(arg1:models.ToastMessage):Promise<void>
		NewWallet(arg1:string):Promise<Error>
		RetrieveContainerFileSystem(arg1:string):Promise<models.Element|Error>
		RetrieveFileSystem():Promise<Array<models.Element>|Error>
		Search(arg1:string):Promise<Array<models.Element>|Error>
		SendSignal(arg1:string,arg2:number):Promise<void>
		SetProgressPercentage(arg1:models.ProgressMessage):Promise<void>
		TopUpNeoWallet(arg1:number):Promise<string|Error>
		UnlockWallet():Promise<Error>
		Upload(arg1:string,arg2:any):Promise<string|Error>
		UploadObject(arg1:string,arg2:string,arg3:any,arg4:models.Reader):Promise<string|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
