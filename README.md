# GasPump Desktop React App

This application uses Wails 2.0 to create a desktop app to interact with the gaspump application.

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

## Frontend Development

However currently rebuilding the frontend on changes is not functional, and so rebuilding every time can be slow. To just develop the frontend, go inside the frontend directory and run `npm start`.

Note you may need to `npm install`
