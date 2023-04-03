# Greenfinch Decentralised storage ecosystem and GUI

Greenfinch aims to be _the_ set of tools to interface with the Neo blockchain and the Neo decentralised file system, NeoFS.

Using Greenfinch, you can create and manage containers, the permissions and the data that is stored within them. Containers allow for policies to be specified defining how and where your data is stored and any level of redundancy of storage you like.

Objects are the 'umbrella' term for the data that is stored within a container and the attributes that are related to the data. This allows for extremely granular management of your decentralised data.

## signing windows TODO

https://github.com/Notifiarr/toolbarr/blob/main/build/windows/signexe.sh

## License

Greenfinch is licensed under [Apache 2.0](https://github.com/configwizard/greenfinch.react/blob/master/LICENSE)

## Starting

Greenfinch is written in Go(lang) and has been developed using Go 1.18 and the UI framework is using [Wails.io](https://wails.io/) and React (html/css/js). To run greenfinch from source, both of these will need to be installed.

Greenfinch currently runs on Windows, Linux and Mac OSX however pre-existing compiled versions are ready for Mac OS X (signed and notorised) and Windows (not yet signed), therefore when running on Windows, you will need to accept it as an untrusted source.

To run it from code, you can either run from the root directory `wails dev` (`make`) or `wails build` on your local system. You may have to run `npm install` prior to running wails

## Code

* To gain familiarity with the code, start inspecting the pkg/manager directory
* Greenfinch has also released their [helper/wrapper SDK](https://github.com/configwizard/gaspump-api) to support developing on NeoFS in Go, and this is relied upon by Greenfinch GUI.`

## Setup

Before really getting started you will need a wallet, and probably some Gas from the testnet for your wallet.

To generate a new wallet, you can either

Generate a new wallet with `./build/bin/GasPump.app/Contents/MacOS/GasPump -wallet=./wallets/wallet.json -password=password`
   1. Note, the application will default to look for ./wallets/wallet.json.
   2. The password will default to password. Feel free to change it, however you will need to pass the password when running the application if you change it. For development it is recommended to keep it as is

or 

Use one from NeoLine/Neon etc

or 

When Greenfinch is running use the GUI to create a new one.

You should see something like this created at the location of the walelt once you have completed this step. This is something that you should keep private.

```shell
created new wallet: NcmPeooTMFsaAf5DTqhATQzka74mLHHQw3
 {
    "version": "3.0",
    "accounts": [
        {
            "address": "NcmPeooTMFsaAf5DTqhATQzka74mLHHQw3",
            "key": "6PYWKee68dCHUihFPdXJsznHKVq1jcU8WDgr8sizcwXCQJiprF13pav5Pc",
            "label": "",
            "contract": {
                "script": "DCECgWXK2rgU88SuRPHVZCFYYj03XIQ6I7anksdD6fFIYMpBVuezJw==",
                "parameters": [
                    {
                        "name": "parameter0",
                        "type": "Signature"
                    }
                ],
                "deployed": false
            },
            "lock": false,
            "isDefault": false
        }
    ],
    "scrypt": {
        "n": 16384,
        "r": 8,
        "p": 8
    },
    "extra": {
        "Tokens": null
    }
}
```
Your wallet address is printed and is the `address` field stated above.

Now you should be able to continue without needing to add any flags if you went with defaults.

You can now get yourself some testnet gas [here](https://neowish.ngd.network/#/) 

## Building

To build the app, from the root directory, run wails build

## Development

To develop with a functional backend (using Wails), run either 

```shell
wails dev
```

to get the application window, or

```shell
wails dev --browser
```
To open a browser window. This can be handy for debugging.

## Transferring Gas to NeoFS

Once you have received Gas from the Neo test faucet, you need to transfer some to the NeoFS smart contract so that you can pay for storage.

Inside the Greenfinch GUI click the walelt icon and transfer some GAS from your wallet to the NeoFS smart contract. You will need to wait for the transaction to complete, and then click refresh to see your new balance


## Useful Tools

* Blockchain explorer for looking up your TESTNET transactions [neo tracker (testnet)](https://testnet.neotracker.io/)
* Neo TESTNET faucet for getting some Gas/Neo [testnet faucet](https://neowish.ngd.network/)
* NeoFS documentation including endpoints (docs)[https://testcdn.fs.neo.org/doc/]


## Troubleshooting:

1. Node version 17

```shell
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:67:19)
    at Object.createHash (node:crypto:130:10)
    at module.exports (/Users/user/Programming Documents/WebServer/untitled/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/user/Programming Documents/WebServer/untitled/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/Users/user/Programming Documents/WebServer/untitled/node_modules/webpack/lib/NormalModule.js:471:10)
    at /Users/user/Programming Documents/WebServer/untitled/node_modules/webpack/lib/NormalModule.js:503:5
    at /Users/user/Programming Documents/WebServer/untitled/node_modules/webpack/lib/NormalModule.js:358:12
    at /Users/user/Programming Documents/WebServer/untitled/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/Users/user/Programming Documents/WebServer/untitled/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/Users/user/Programming Documents/WebServer/untitled/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
/Users/user/Programming Documents/WebServer/untitled/node_modules/react-scripts/scripts/start.js:19
  throw err;
  ^
```

This is due to
> This is caused by the latest node.js V17 compatible issues with OpenSSL, see this and this issue on GitHub.

> The easiest thing is just downgrade from node.js V17 to node.js V16. See this post on how to downgrade node.js.
