// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {manager} from '../models';
import {io} from '../models';
import {object} from '../models';
import {pool} from '../models';
import {map[string]manager} from '../models';
import {context} from '../models';

export function AddContact(arg1:string,arg2:string,arg3:string,arg4:string):Promise<Array<manager.contact>>;

export function AddSharedContainer(arg1:string):Promise<void>;

export function ContainersChanged():Promise<void>;

export function CopyToClipboard(arg1:string):Promise<void>;

export function CreateContainer(arg1:string,arg2:string,arg3:boolean):Promise<void>;

export function DeleteContact(arg1:string):Promise<Array<manager.contact>>;

export function DeleteContainer(arg1:string):Promise<Array<manager.Element>>;

export function DeleteObject(arg1:string,arg2:string):Promise<Array<manager.Element>>;

export function Download(arg1:string,arg2:string,arg3:string):Promise<void>;

export function EnableCache(arg1:boolean):Promise<void>;

export function EnableLocalServer(arg1:boolean):Promise<void>;

export function ForceSync():Promise<void>;

export function Get(arg1:string,arg2:string,arg3:string,arg4:io.Writer):Promise<Array<number>>;

export function GetAccountInformation():Promise<manager.Account>;

export function GetObjectMetaData(arg1:string,arg2:string):Promise<object.Object>;

export function GetVersion():Promise<string>;

export function ListContainerIDs():Promise<Array<string>>;

export function ListContainerObjects(arg1:string,arg2:boolean,arg3:boolean):Promise<Array<manager.Element>>;

export function ListContainers(arg1:boolean,arg2:boolean):Promise<Array<manager.Element>>;

export function ListSharedContainerObjects(arg1:string,arg2:boolean):Promise<Array<manager.Element>>;

export function ListSharedContainers():Promise<Array<manager.Element>>;

export function LoadWallet(arg1:string):Promise<void>;

export function LoadWalletWithPath(arg1:string,arg2:string):Promise<void>;

export function LoadWalletWithoutPassword():Promise<string>;

export function MakeNotification(arg1:manager.NotificationMessage):Promise<void>;

export function MakeToast(arg1:manager.UXMessage):Promise<void>;

export function MarkAllNotificationsRead():Promise<void>;

export function MarkNotificationRead(arg1:string):Promise<void>;

export function NetworkChangeNotification():Promise<void>;

export function NewListReadOnlyContainerContents(arg1:number):Promise<Array<manager.Element>>;

export function NewWallet(arg1:string,arg2:string):Promise<void>;

export function NewWalletFromWIF(arg1:string,arg2:string,arg3:string):Promise<void>;

export function Notifications():Promise<Array<manager.NotificationMessage>>;

export function OpenInDefaultBrowser(arg1:string):Promise<void>;

export function Pool():Promise<pool.Pool>;

export function RecentWallets():Promise<map[string]manager.cleanedWallet>;

export function RemoveSharedContainer(arg1:string):Promise<Array<manager.Element>>;

export function RestrictContainer(arg1:string,arg2:string):Promise<void>;

export function RetrieveContactByWalletAddress(arg1:string):Promise<manager.contact>;

export function RetrieveContacts():Promise<Array<manager.contact>>;

export function SaveWalletWithoutPassword():Promise<string>;

export function SendSignal(arg1:string,arg2:any):Promise<void>;

export function SetProgressPercentage(arg1:manager.ProgressMessage):Promise<void>;

export function SetSelectedNetwork(arg1:string):Promise<manager.NetworkData>;

export function SetWalletDebugging(arg1:string,arg2:string):Promise<void>;

export function SetupServer(arg1:context.Context):Promise<void>;

export function TopUpNeoWallet(arg1:number):Promise<string>;

export function TransferToken(arg1:string,arg2:number):Promise<string>;

export function UnlockWallet():Promise<void>;

export function Upload(arg1:string,arg2:{[key: string]: string}):Promise<Array<manager.Element>>;

export function UploadObject(arg1:string,arg2:string,arg3:{[key: string]: string}):Promise<Array<manager.Element>>;
