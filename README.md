# GasPump Desktop React App

This application uses Wails 2.0 to create a desktop app to interact with the gaspump application.

## To do

* pipe the upload and response with notifications on upload/download status

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
## Setup

Before really getting started you will need a wallet, and probably some Gas from the testnet for your wallet.

To generate a new wallet, you can:

1. Build the application `wails build`
2. Generate a new wallet with `./build/bin/GasPump.app/Contents/MacOS/GasPump -wallet=./wallets/wallet.json -password=password`
   1. Note, the application will default to look for ./wallets/wallet.json.
   2. The password will default to password. Feel free to change it, however you will need to pass the password when running the application if you change it. For development it is recommended to keep it as is

You should see something like:
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

Once you have received Gas from the Neo test faucet, you need to transfer some to the NeoFS smart contract so that you can pay for storage

```shell
build/bin/GasPump.app/Contents/MacOS/GasPump -wallet=./wallets/wallet.json -address=NadZ8YfvkddivcFFkztZgfwxZyKf1acpRF -amount=100000000 transfer
```
Where
* `NadZ8YfvkddivcFFkztZgfwxZyKf1acpRF` is the NeoFS *TESTNET* address
* `100000000` is 1 Gas to a precision of 8 (accurate to 8dp)

After that, run the app as normal and you will see your balance has increased

## Tools

* Blockchain explorer for looking up your TESTNET transactions [neo tracker (testnet)](https://testnet.neotracker.io/)
* Neo TESTNET faucet for getting some Gas/Neo [testnet faucet](https://neowish.ngd.network/)
* NeoFS documentation including endpoints (docs)[https://testcdn.fs.neo.org/doc/]

## Frontend Development

However currently rebuilding the frontend on changes is not functional, and so rebuilding every time can be slow. To just develop the frontend, go inside the frontend directory and run `npm start`.

Note you may need to `npm install`
