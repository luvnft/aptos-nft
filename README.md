## Create Aptos Dapp Digital Asset Template

Digital Assets are the NFT standard for Aptos. The Digital Asset template provides an end-to-end NFT minting dapp with a beautiful pre-made UI users can quickly adjust and deploy into a live server.

Read more about how to use the template [here](https://aptos.dev/create-aptos-dapp/templates/digital-asset)

The Digital Asset template provides 3 pages:

- **Public Mint NFT Page** - A page for the public to mint NFTs.
- **Create Collection Page** - A page for creating new NFT collections. This page is not accessible on production.
- **My Collections Page** - A page to view all the collections created under the current Move module (smart contract). This page is not accessible on production.

### What tools the template uses?

- React framework
- Vite development tool
- shadcn/ui + tailwind for styling
- Aptos TS SDK
- Aptos Wallet Adapter
- Node based Move commands

### What Move commands are available?

The tool utilizes [aptos-cli npm package](https://github.com/aptos-labs/aptos-cli) that lets us run Aptos CLI in a Node environment.

Some commands are built-in the template and can be ran as a npm script, for example:

- `npm run move:init` - a command to initialize an account to publish the Move contract and to configure the development environment
- `npm run move:publish` - a command to publish the Move contract
- `npm run move:upgrade` - a command to upgrade the Move contract
- `npm run move:test` - a command to run Move unit tests
- `npm run move:compile` - a command to compile the Move contract

For all other available CLI commands, can run `npx aptos` and see a list of all available commands.


### Links
[Deployment on Movement Testnet](https://explorer.movementnetwork.xyz/account/0xdef8a64cc21403856be63f9f9a14de737d7b7ba601afd5c63227fcb32859217b/modules/code/launchpad?network=testnet)
[Deployment on Aptos Testnet](https://explorer.aptoslabs.com/account/0x22dbcdc30072e4f8dc0399afd63959bc14b3596d9df72f7b05178a43cbb872a0/modules/code/launchpad?network=testnet)