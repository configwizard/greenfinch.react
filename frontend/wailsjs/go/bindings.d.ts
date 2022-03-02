interface go {
  "manager": {
    "Manager": {
		Client():Promise<Client>
		CreateContainer(arg1:string):Promise<Error>
		Delete(arg1:string,arg2:string):Promise<Error>
		DeleteContainer(arg1:string):Promise<Error>
		DeleteObject(arg1:string,arg2:string):Promise<Error>
		Download(arg1:string,arg2:string):Promise<Error>
		Get(arg1:string,arg2:string,arg3:Writer):Promise<Array<number>|Error>
		GetAccountInformation():Promise<Account|Error>
		GetContainer(arg1:string):Promise<Container|Error>
		GetObjectMetaData(arg1:string,arg2:string):Promise<ObjectHeadRes|Error>
		ListContainerIDs():Promise<Array<string>|Error>
		ListContainerObjectIDs(arg1:string):Promise<Array<string>|Error>
		ListContainerPopulatedObjects(arg1:string):Promise<Array<Element>|Error>
		ListContainers():Promise<Array<Element>|Error>
		ListContainersAsync():Promise<Error>
		ListObjectsAsync(arg1:string):Promise<Error>
		MakeToast(arg1:ToastMessage):Promise<void>
		RetrieveContainerFileSystem(arg1:string):Promise<Element|Error>
		RetrieveFileSystem():Promise<Array<Element>|Error>
		Search(arg1:string):Promise<Array<Element>|Error>
		SendSignal(arg1:string,arg2:number):Promise<void>
		SetProgressPercentage(arg1:ProgressMessage):Promise<void>
		Upload(arg1:string,arg2:any):Promise<string|Error>
		UploadObject(arg1:string,arg2:string,arg3:any,arg4:Reader):Promise<string|Error>
    },
  }

  "mocker": {
    "Mocker": {
		GetAccountInformation(arg1:string):Promise<Account|Error>
		ListContainerPopulatedObjects(arg1:string):Promise<Array<Element>|Error>
		ListContainers(arg1:string):Promise<Array<Element>|Error>
		Search(arg1:string,arg2:string):Promise<Array<Element>|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
