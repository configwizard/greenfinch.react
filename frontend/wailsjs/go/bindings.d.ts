interface go {
  "manager": {
    "Manager": {
		Client():Promise<Client>
		CreateContainer(arg1:string):Promise<string|Error>
		DeleteContainer(arg1:string):Promise<Error>
		DeleteObject(arg1:string,arg2:string):Promise<Error>
		GetContainer(arg1:string):Promise<Container|Error>
		GetNeoFSBalance():Promise<Balance|Error>
		GetObject(arg1:string,arg2:string,arg3:Writer):Promise<Array<number>|Error>
		GetObjectMetaData(arg1:string,arg2:string):Promise<ObjectHeadRes|Error>
		ListContainerObjects(arg1:string):Promise<Array<string>|Error>
		ListContainers():Promise<Array<string>|Error>
		RetrieveContainerFileSystem(arg1:string):Promise<Element|Error>
		RetrieveFileSystem():Promise<Array<Element>|Error>
		Upload(arg1:string,arg2:any):Promise<string|Error>
		UploadObject(arg1:string,arg2:string,arg3:any):Promise<string|Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
