export default {
    "ethereumNetwork": {
      "1": "",
      "3": "Ropsten"
    },
    "dappVersion": "BETA 0.3",
    "etherscanURL": "https://etherscan.io/",
    "etherscanURLRopsten": "https://ropsten.etherscan.io/",
    "uniSwapInfoURL": "https://uniswap.info/token/",
    "uniSwapSwapURLTemplate": "https://app.uniswap.org/#/swap?inputCurrency={0}&outputCurrency={1}",
    "penSwapSwapURLTemplate": "https://penguinswap.eth.link/#/swap?inputCurrency={0}&outputCurrency={1}",
    "uniSwapPoolURLTemplate": "https://app.uniswap.org/#/pool?inputCurrency={0}&outputCurrency={1}",
    "coingeckoEthereumPriceURL": "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum",
    "coingeckoEthereumPriceRequestInterval": 600000,
    "trustwalletImgURLTemplate": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/{0}/logo.png",
    "defaultOcelotTokenAddress": "0x9784b427ecb5275c9300ea34adef57923ab170af",
    "defaultOcelotTokenAddressRopsten": "0x6ae6cf934b2bd8c84d932aee75102ca2ef1bf2ce",
    "daiTokenAddress": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "daiTokenAddressRopsten": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "singleTokenLength": 23000,
    "dfoAddress": "0xc3BE549499f1e504c793a6c89371Bd7A98229500",
    "dfoAddressRopsten": "0x761E02FEC5A21C6d3F284bd536dB2D2d33d5540B",
    "ensAddress": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    "usdcTokenAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "usdcTokenAddressRopsten": "0xBc1EF4dddFAcb08e80C368eE2AAD69265775DCb9",
    "uniSwapV2RouterAddress": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    "uniSwapV2FactoryAddress": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    "quickScopeAddress": "0x99b0c942f12b85df3f5e2a5b0af2c437da31cb85",
    "quickScopeAddressRopsten": "0xf67e59E377d070841C5057b67Cfe27F5d341905b",
    "ipfsHost": "https://ipfs.infura.io:5001/api/v0/",
    "ipfsUrlTemplates": ["ipfs://ipfs/", "ipfs://"],
    "ipfsUrlChanger": "https://gateway.ipfs.io/ipfs/",
    "deploySearchStart": 9779603,
    "deploySearchStartRopsten": 7465062,
    "blockSearchSection": 9000000,
    "transactionConfirmations": 0,
    "transactionConfirmationsTimeoutMillis": 7000,
    "indexesURL": "https://raw.githubusercontent.com/b-u-i-d-l/bazar-tokens-list/master/dist/indexes.json",
    "decentralizedFlexibleOrganizationsURL": "https://raw.githubusercontent.com/b-u-i-d-l/bazar-tokens-list/master/dist/decentralizedFlexibleOrganizations.json",
    "decentralizedFlexibleOrganizationsURLRopsten": "https://raw.githubusercontent.com/b-u-i-d-l/bazar-tokens-list/master/dist/programmableEquities.json",
    "uniswapTokensURL": "https://raw.githubusercontent.com/b-u-i-d-l/bazar-tokens-list/master/dist/uniswapTokens.json",
    "itemsListURL": "https://raw.githubusercontent.com/b-u-i-d-l/WIMD-uniswap/master/wimdlist.json",
    "outOfStandardTokens": [
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "0xd46ba6d942050d489dbd938a2c909a5d5039a161"
    ],
    "uiDecimals": 25,
    "slippageNumerator": 5,
    "slippageDenominator": 1000,
    "deployMetadataLinkSourceLocationId": 169,
    "deployMetadataLinkSourceLocationIdRopsten": 405,
    "QuickScopeABI": [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "uniswapV2RouterAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "context",
        "outputs": [
          {
            "internalType": "address",
            "name": "uniswapV2RouterAddress",
            "type": "address"
          },
          { "internalType": "address", "name": "wethAddress", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "pairAddress", "type": "address" },
          { "internalType": "uint256", "name": "gToken", "type": "uint256" },
          {
            "internalType": "address",
            "name": "tokenTAddress",
            "type": "address"
          },
          { "internalType": "uint256", "name": "amountGIn", "type": "uint256" }
        ],
        "name": "quickScope",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      { "stateMutability": "payable", "type": "receive" }
    ],
    "OcelotAbi": [
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "finalize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "chainSize",
            "type": "uint256"
          }
        ],
        "name": "Finalized",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "name": "mint",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "name": "mint",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "name": "mintAndFinalize",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "name": "mintAndFinalize",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "chunkPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "chunkSize",
            "type": "uint256"
          }
        ],
        "name": "Minted",
        "type": "event"
      },
      { "stateMutability": "payable", "type": "receive" },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "content",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "metadata",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "propsalAbi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Accept",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "MoveToAccept",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "MoveToRefuse",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "Refuse",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "RetireAccept",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "RetireAll",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "RetireRefuse",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "accept",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "disable",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCodeName",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getLocation",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMethodSignature",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProposer",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getReplaces",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getReturnAbiParametersArray",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getSourceLocation",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getSourceLocationId",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getSurveyDuration",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getSurveyEndBlock",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "addr", "type": "address" }
        ],
        "name": "getVote",
        "outputs": [
          { "internalType": "uint256", "name": "accept", "type": "uint256" },
          { "internalType": "uint256", "name": "refuse", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getVotes",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getVotesHardCapToReach",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "address", "name": "location", "type": "address" },
          {
            "internalType": "string",
            "name": "methodSignature",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "returnAbiParametersArray",
            "type": "string"
          },
          { "internalType": "string", "name": "replaces", "type": "string" },
          { "internalType": "address", "name": "proxy", "type": "address" }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isDisabled",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isEmergency",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isInternal",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isSubmitable",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isTerminated",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isVotesHardCapReached",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "moveToAccept",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "moveToRefuse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "needsSender",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "refuse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "retireAccept",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "retireAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "retireRefuse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bool", "name": "emergency", "type": "bool" },
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sourceLocationId",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "submitable", "type": "bool" },
          { "internalType": "bool", "name": "isInternal", "type": "bool" },
          { "internalType": "bool", "name": "needsSender", "type": "bool" },
          { "internalType": "address", "name": "proposer", "type": "address" },
          { "internalType": "uint256", "name": "votesHardCap", "type": "uint256" }
        ],
        "name": "setCollateralData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "start",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "terminate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "toJSON",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "votingTokenAbi": [
      {
        "inputs": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "decimals", "type": "uint256" },
          { "internalType": "uint256", "name": "totalSupply", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          {
            "internalType": "uint256",
            "name": "subtractedValue",
            "type": "uint256"
          }
        ],
        "name": "decreaseAllowance",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "addedValue", "type": "uint256" }
        ],
        "name": "increaseAllowance",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "decimals", "type": "uint256" },
          { "internalType": "uint256", "name": "totalSupply", "type": "uint256" }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      { "stateMutability": "payable", "type": "receive" }
    ],
    "stateHolderAbi": [
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "clear",
        "outputs": [
          { "internalType": "string", "name": "oldDataType", "type": "string" },
          { "internalType": "bytes", "name": "oldVal", "type": "bytes" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" },
          { "internalType": "address", "name": "val", "type": "address" }
        ],
        "name": "setAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" },
          { "internalType": "bool", "name": "val", "type": "bool" }
        ],
        "name": "setBool",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" },
          { "internalType": "bytes", "name": "val", "type": "bytes" }
        ],
        "name": "setBytes",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" },
          { "internalType": "string", "name": "val", "type": "string" }
        ],
        "name": "setString",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" },
          { "internalType": "uint256", "name": "val", "type": "uint256" }
        ],
        "name": "setUint256",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
      {
        "inputs": [
          { "internalType": "string", "name": "a", "type": "string" },
          { "internalType": "string", "name": "b", "type": "string" }
        ],
        "name": "compareStrings",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "exists",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "string", "name": "m", "type": "string" }],
        "name": "formatReturnAbiParametersArray",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getBool",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getBytes",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getDataType",
        "outputs": [
          { "internalType": "string", "name": "dataType", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sourceLocationId",
            "type": "uint256"
          },
          { "internalType": "address", "name": "location", "type": "address" }
        ],
        "name": "getFirstJSONPart",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getStateSize",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getString",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "varName", "type": "string" }
        ],
        "name": "getUint256",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "bytes", "name": "b", "type": "bytes" }],
        "name": "toAddress",
        "outputs": [
          { "internalType": "address", "name": "addr", "type": "address" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "start", "type": "uint256" },
          { "internalType": "uint256", "name": "l", "type": "uint256" }
        ],
        "name": "toJSON",
        "outputs": [
          { "internalType": "string", "name": "json", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "toJSON",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "string", "name": "str", "type": "string" }],
        "name": "toLowerCase",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "_addr", "type": "address" }
        ],
        "name": "toString",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "_i", "type": "uint256" }
        ],
        "name": "toString",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "bytes", "name": "bs", "type": "bytes" }],
        "name": "toUint256",
        "outputs": [
          { "internalType": "uint256", "name": "x", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ],
    "functionalitiesManagerAbi": [
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sourceLocationId",
            "type": "uint256"
          },
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bool", "name": "submitable", "type": "bool" },
          {
            "internalType": "string",
            "name": "methodSignature",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "returnAbiParametersArray",
            "type": "string"
          },
          { "internalType": "bool", "name": "isInternal", "type": "bool" },
          { "internalType": "bool", "name": "needsSender", "type": "bool" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "addFunctionality",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sourceLocationId",
            "type": "uint256"
          },
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bool", "name": "submitable", "type": "bool" },
          {
            "internalType": "string",
            "name": "methodSignature",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "returnAbiParametersArray",
            "type": "string"
          },
          { "internalType": "bool", "name": "isInternal", "type": "bool" },
          { "internalType": "bool", "name": "needsSender", "type": "bool" }
        ],
        "name": "addFunctionality",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "clearCallingContext",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "functionalitiesToJSON",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "start", "type": "uint256" },
          { "internalType": "uint256", "name": "l", "type": "uint256" }
        ],
        "name": "functionalitiesToJSON",
        "outputs": [
          {
            "internalType": "string",
            "name": "functionsJSONArray",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "functionalityNames",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "start", "type": "uint256" },
          { "internalType": "uint256", "name": "l", "type": "uint256" }
        ],
        "name": "functionalityNames",
        "outputs": [
          {
            "internalType": "string",
            "name": "functionsJSONArray",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" }
        ],
        "name": "functionalityToJSON",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getFunctionalitiesAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" }
        ],
        "name": "getFunctionalityData",
        "outputs": [
          { "internalType": "address", "name": "", "type": "address" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "string", "name": "", "type": "string" },
          { "internalType": "address", "name": "", "type": "address" },
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getProxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" }
        ],
        "name": "hasFunctionality",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "getMinimumBlockNumberSourceLocationId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "getMinimumBlockNumberFunctionalityAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "getEmergencyMinimumBlockNumberSourceLocationId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "getEmergencyMinimumBlockNumberFunctionalityAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "getEmergencySurveyStakingSourceLocationId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "getEmergencySurveyStakingFunctionalityAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "checkVoteResultSourceLocationId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "checkVoteResultFunctionalityAddress",
            "type": "address"
          }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "functionality",
            "type": "address"
          }
        ],
        "name": "isAuthorizedFunctionality",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "functionality",
            "type": "address"
          }
        ],
        "name": "isValidFunctionality",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "bytes", "name": "data", "type": "bytes" },
          { "internalType": "uint8", "name": "submitable", "type": "uint8" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "preConditionCheck",
        "outputs": [
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" }
        ],
        "name": "removeFunctionality",
        "outputs": [
          { "internalType": "bool", "name": "removed", "type": "bool" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "location", "type": "address" }
        ],
        "name": "setCallingContext",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "proposalAddress",
            "type": "address"
          }
        ],
        "name": "setupFunctionality",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "proxyAbi": [
      {
        "inputs": [
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bytes", "name": "payload", "type": "bytes" }
        ],
        "name": "callFromManager",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" },
          { "internalType": "bytes", "name": "", "type": "bytes" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "newAddress", "type": "address" },
          { "internalType": "bytes", "name": "initPayload", "type": "bytes" }
        ],
        "name": "changeProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "position",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "oldAddress",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newAddress",
            "type": "address"
          }
        ],
        "name": "DelegateChanged",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "proposalAddress",
            "type": "address"
          }
        ],
        "name": "disableProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "eventSignature",
            "type": "string"
          },
          { "internalType": "bytes", "name": "firstIndex", "type": "bytes" },
          { "internalType": "bytes", "name": "secondIndex", "type": "bytes" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "emitEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "address", "name": "proposal", "type": "address" },
          { "internalType": "string", "name": "replaced", "type": "string" },
          {
            "internalType": "address",
            "name": "replacedSourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "replacedSourceLocationId",
            "type": "uint256"
          },
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bool", "name": "submitable", "type": "bool" },
          {
            "internalType": "string",
            "name": "methodSignature",
            "type": "string"
          },
          { "internalType": "bool", "name": "isInternal", "type": "bool" },
          { "internalType": "bool", "name": "needsSender", "type": "bool" },
          {
            "internalType": "address",
            "name": "proposalAddress",
            "type": "address"
          }
        ],
        "name": "emitFromManager",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "key",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "firstIndex",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "secondIndex",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "Event",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          { "internalType": "bool", "name": "is721", "type": "bool" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "flushToWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "codeName",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "proposal",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "replaced",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "replacedSourceLocation",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "replacedSourceLocationId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "replacedLocation",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "replacedWasSubmitable",
            "type": "bool"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "replacedMethodSignature",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "replacedWasInternal",
            "type": "bool"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "replacedNeededSender",
            "type": "bool"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "replacedProposal",
            "type": "address"
          }
        ],
        "name": "FunctionalitySet",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "votingTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "functionalityProposalManagerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "stateHolderAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "functionalityModelsManagerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "functionalitiesManagerAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "walletAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "doubleProxyAddress",
            "type": "address"
          }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "bool", "name": "emergency", "type": "bool" },
          {
            "internalType": "address",
            "name": "sourceLocation",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "sourceLocationId",
            "type": "uint256"
          },
          { "internalType": "address", "name": "location", "type": "address" },
          { "internalType": "bool", "name": "submitable", "type": "bool" },
          {
            "internalType": "string",
            "name": "methodSignature",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "returnParametersJSONArray",
            "type": "string"
          },
          { "internalType": "bool", "name": "isInternal", "type": "bool" },
          { "internalType": "bool", "name": "needsSender", "type": "bool" },
          { "internalType": "string", "name": "replaces", "type": "string" }
        ],
        "name": "newProposal",
        "outputs": [
          {
            "internalType": "address",
            "name": "proposalAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "proposal",
            "type": "address"
          }
        ],
        "name": "Proposal",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "proposal",
            "type": "address"
          }
        ],
        "name": "ProposalCheck",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "proposal",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          }
        ],
        "name": "ProposalSet",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "newAddress",
            "type": "address"
          }
        ],
        "name": "ProxyChanged",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "position", "type": "uint256" },
          { "internalType": "address", "name": "newAddress", "type": "address" }
        ],
        "name": "setDelegate",
        "outputs": [
          { "internalType": "address", "name": "oldAddress", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "proposalAddress",
            "type": "address"
          }
        ],
        "name": "startProposal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "submit",
        "outputs": [
          { "internalType": "bytes", "name": "returnData", "type": "bytes" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "receiver", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" },
          { "internalType": "address", "name": "token", "type": "address" }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "receiver", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "bytes", "name": "data", "type": "bytes" },
          { "internalType": "bool", "name": "safe", "type": "bool" },
          { "internalType": "address", "name": "token", "type": "address" }
        ],
        "name": "transfer721",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getDelegates",
        "outputs": [
          { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getDoubleProxyAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMVDFunctionalitiesManagerAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMVDFunctionalityModelsManagerAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMVDFunctionalityProposalManagerAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMVDWalletAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getStateHolderAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getToken",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "functionality",
            "type": "address"
          }
        ],
        "name": "isAuthorizedFunctionality",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "proposal", "type": "address" }
        ],
        "name": "isValidProposal",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "codeName", "type": "string" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "read",
        "outputs": [
          { "internalType": "bytes", "name": "returnData", "type": "bytes" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "ENSAbi": [
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "operator", "type": "address" }
        ],
        "name": "isApprovedForAll",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "recordExists",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "resolver",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "operator", "type": "address" },
          { "internalType": "bool", "name": "approved", "type": "bool" }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "setOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "resolver", "type": "address" },
          { "internalType": "uint64", "name": "ttl", "type": "uint64" }
        ],
        "name": "setRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "address", "name": "resolver", "type": "address" }
        ],
        "name": "setResolver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "bytes32", "name": "label", "type": "bytes32" },
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "setSubnodeOwner",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "bytes32", "name": "label", "type": "bytes32" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "resolver", "type": "address" },
          { "internalType": "uint64", "name": "ttl", "type": "uint64" }
        ],
        "name": "setSubnodeRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "uint64", "name": "ttl", "type": "uint64" }
        ],
        "name": "setTTL",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "ttl",
        "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "resolverAbi": [
      {
        "inputs": [
          { "internalType": "contract ENS", "name": "ens", "type": "address" },
          { "internalType": "address", "name": "dfoHub", "type": "address" },
          { "internalType": "bytes", "name": "hashContent", "type": "bytes" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "a",
            "type": "address"
          }
        ],
        "name": "AddrChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "coinType",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "newAddress",
            "type": "bytes"
          }
        ],
        "name": "AddressChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "target",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isAuthorised",
            "type": "bool"
          }
        ],
        "name": "AuthorisationChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "node",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "hash",
            "type": "bytes"
          }
        ],
        "name": "ContenthashChanged",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "contract ENS", "name": "ens", "type": "address" },
          { "internalType": "address", "name": "dfoHub", "type": "address" },
          { "internalType": "bytes", "name": "hashContent", "type": "bytes" }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "string", "name": "ensDomain", "type": "string" },
          { "internalType": "address", "name": "a", "type": "address" }
        ],
        "name": "setAddr",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "uint256", "name": "coinType", "type": "uint256" },
          { "internalType": "bytes", "name": "a", "type": "bytes" }
        ],
        "name": "setAddr",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "address", "name": "a", "type": "address" }
        ],
        "name": "setAddr",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "address", "name": "target", "type": "address" },
          { "internalType": "bool", "name": "isAuthorised", "type": "bool" }
        ],
        "name": "setAuthorisation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "bytes", "name": "hash", "type": "bytes" }
        ],
        "name": "setContenthash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "addr",
        "outputs": [
          { "internalType": "address payable", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" },
          { "internalType": "uint256", "name": "coinType", "type": "uint256" }
        ],
        "name": "addr",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes32", "name": "node", "type": "bytes32" }
        ],
        "name": "contenthash",
        "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "address", "name": "a", "type": "address" }],
        "name": "subdomain",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "bytes4", "name": "interfaceID", "type": "bytes4" }
        ],
        "name": "supportsInterface",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "pure",
        "type": "function"
      }
    ],
    "uniSwapV2RouterAbi": [
      {
        "inputs": [],
        "name": "WETH",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "tokenA", "type": "address" },
          { "internalType": "address", "name": "tokenB", "type": "address" },
          {
            "internalType": "uint256",
            "name": "amountADesired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountBDesired",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
          { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "addLiquidity",
        "outputs": [
          { "internalType": "uint256", "name": "amountA", "type": "uint256" },
          { "internalType": "uint256", "name": "amountB", "type": "uint256" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          {
            "internalType": "uint256",
            "name": "amountTokenDesired",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
          },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "addLiquidityETH",
        "outputs": [
          { "internalType": "uint256", "name": "amountToken", "type": "uint256" },
          { "internalType": "uint256", "name": "amountETH", "type": "uint256" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "factory",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveIn", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }
        ],
        "name": "getAmountIn",
        "outputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveIn", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }
        ],
        "name": "getAmountOut",
        "outputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
          { "internalType": "address[]", "name": "path", "type": "address[]" }
        ],
        "name": "getAmountsIn",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "address[]", "name": "path", "type": "address[]" }
        ],
        "name": "getAmountsOut",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountA", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveA", "type": "uint256" },
          { "internalType": "uint256", "name": "reserveB", "type": "uint256" }
        ],
        "name": "quote",
        "outputs": [
          { "internalType": "uint256", "name": "amountB", "type": "uint256" }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "tokenA", "type": "address" },
          { "internalType": "address", "name": "tokenB", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
          { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "removeLiquidity",
        "outputs": [
          { "internalType": "uint256", "name": "amountA", "type": "uint256" },
          { "internalType": "uint256", "name": "amountB", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
          },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "removeLiquidityETH",
        "outputs": [
          { "internalType": "uint256", "name": "amountToken", "type": "uint256" },
          { "internalType": "uint256", "name": "amountETH", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
          },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
        "outputs": [
          { "internalType": "uint256", "name": "amountETH", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
          },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "bool", "name": "approveMax", "type": "bool" },
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "removeLiquidityETHWithPermit",
        "outputs": [
          { "internalType": "uint256", "name": "amountToken", "type": "uint256" },
          { "internalType": "uint256", "name": "amountETH", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountTokenMin",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountETHMin",
            "type": "uint256"
          },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "bool", "name": "approveMax", "type": "bool" },
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
        "outputs": [
          { "internalType": "uint256", "name": "amountETH", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "tokenA", "type": "address" },
          { "internalType": "address", "name": "tokenB", "type": "address" },
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
          { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
          { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "bool", "name": "approveMax", "type": "bool" },
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "removeLiquidityWithPermit",
        "outputs": [
          { "internalType": "uint256", "name": "amountA", "type": "uint256" },
          { "internalType": "uint256", "name": "amountB", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapETHForExactTokens",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactETHForTokens",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactTokensForETH",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
          { "internalType": "uint256", "name": "amountInMax", "type": "uint256" },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapTokensForExactETH",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
          { "internalType": "uint256", "name": "amountInMax", "type": "uint256" },
          { "internalType": "address[]", "name": "path", "type": "address[]" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "swapTokensForExactTokens",
        "outputs": [
          { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "ERC721Abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approved",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "ApprovalForAll",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [
          { "internalType": "uint256", "name": "balance", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "getApproved",
        "outputs": [
          { "internalType": "address", "name": "operator", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "operator", "type": "address" }
        ],
        "name": "isApprovedForAll",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "ownerOf",
        "outputs": [
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "operator", "type": "address" },
          { "internalType": "bool", "name": "_approved", "type": "bool" }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "uniSwapV2FactoryAbi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "token0",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "token1",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "PairCreated",
        "type": "event"
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "allPairs",
        "outputs": [
          { "internalType": "address", "name": "pair", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "allPairsLength",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "tokenA", "type": "address" },
          { "internalType": "address", "name": "tokenB", "type": "address" }
        ],
        "name": "createPair",
        "outputs": [
          { "internalType": "address", "name": "pair", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "feeTo",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "feeToSetter",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "tokenA", "type": "address" },
          { "internalType": "address", "name": "tokenB", "type": "address" }
        ],
        "name": "getPair",
        "outputs": [
          { "internalType": "address", "name": "pair", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "uniSwapV2PairAbi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1",
            "type": "uint256"
          }
        ],
        "name": "Mint",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0In",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1In",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount0Out",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount1Out",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "Swap",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint112",
            "name": "reserve0",
            "type": "uint112"
          },
          {
            "indexed": false,
            "internalType": "uint112",
            "name": "reserve1",
            "type": "uint112"
          }
        ],
        "name": "Sync",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "DOMAIN_SEPARATOR",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "MINIMUM_LIQUIDITY",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "PERMIT_TYPEHASH",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" }
        ],
        "name": "burn",
        "outputs": [
          { "internalType": "uint256", "name": "amount0", "type": "uint256" },
          { "internalType": "uint256", "name": "amount1", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "factory",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getReserves",
        "outputs": [
          { "internalType": "uint112", "name": "reserve0", "type": "uint112" },
          { "internalType": "uint112", "name": "reserve1", "type": "uint112" },
          {
            "internalType": "uint32",
            "name": "blockTimestampLast",
            "type": "uint32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "kLast",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" }
        ],
        "name": "mint",
        "outputs": [
          { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "nonces",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "price0CumulativeLast",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "price1CumulativeLast",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" }
        ],
        "name": "skim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount0Out", "type": "uint256" },
          { "internalType": "uint256", "name": "amount1Out", "type": "uint256" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "swap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "sync",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token0",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token1",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "LiquidityMiningContractABI": [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "mainTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "rewardTokenAddress",
            "type": "address"
          },
          { "internalType": "uint256", "name": "startBlock", "type": "uint256" },
          { "internalType": "uint256", "name": "endBlock", "type": "uint256" },
          { "internalType": "address", "name": "doubleProxy", "type": "address" },
          { "internalType": "address[]", "name": "tokens", "type": "address[]" },
          {
            "internalType": "uint256[]",
            "name": "timeWindows",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "rewardMultipliers",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "rewardDividers",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "rewardSplitTranches",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tier",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "position",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "poolPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "firstAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "secondAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "poolAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          }
        ],
        "name": "Flushed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tier",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          }
        ],
        "name": "PartialWithdrawn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tier",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "poolPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "firstAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "secondAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "poolAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "endBlock",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256[]",
            "name": "partialRewardBlockTimes",
            "type": "uint256[]"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "splittedReward",
            "type": "uint256"
          }
        ],
        "name": "Staked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tier",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "position",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "poolPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "firstAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "secondAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "poolAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          }
        ],
        "name": "Unlocked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tier",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "poolPosition",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "firstAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "secondAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "poolAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          }
        ],
        "name": "Withdrawn",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "doubleProxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "endBlock",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "flushToDFO",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" }
        ],
        "name": "getStakingCap",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" }
        ],
        "name": "getStakingInfo",
        "outputs": [
          { "internalType": "uint256", "name": "minCap", "type": "uint256" },
          { "internalType": "uint256", "name": "hardCap", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "remainingToStake",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" }
        ],
        "name": "length",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "partialReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardTokenAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newDoubleProxy",
            "type": "address"
          }
        ],
        "name": "setDoubleProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "poolPosition",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "originalFirstAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "firstAmountMin",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "value", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "secondAmountMin",
            "type": "uint256"
          }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "stakeInfo",
        "outputs": [
          { "internalType": "address", "name": "", "type": "address" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256", "name": "", "type": "uint256" },
          { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startBlock",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "tierData",
        "outputs": [
          { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
          { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
          { "internalType": "uint256[]", "name": "", "type": "uint256[]" },
          { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "tokenAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "tokens",
        "outputs": [
          { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "poolPosition", "type": "uint256" }
        ],
        "name": "totalPoolAmount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "unlock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "tier", "type": "uint256" },
          { "internalType": "uint256", "name": "position", "type": "uint256" }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "stateHolderTypes": ["address", "bool", "string", "uint256"],
    "DoubleProxyAbi": [
      {
        "inputs": [
          { "internalType": "address[]", "name": "proxies", "type": "address[]" },
          { "internalType": "address", "name": "currentProxy", "type": "address" }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "isProxy",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxies",
        "outputs": [
          { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "start", "type": "uint256" },
          { "internalType": "uint256", "name": "offset", "type": "uint256" }
        ],
        "name": "proxies",
        "outputs": [
          { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxiesLength",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "proxy",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setProxy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "IFunctionalityAbi": [
      {
        "inputs": [],
        "name": "getMetadataLink",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "blockTiers": {
      "Daily": {
        "averages": [5800, 6400, 7000]
      },
      "Weekly": {
        "averages": [43500, 48000, 52500]
      },
      "Monthly": {
        "averages": [174000, 192000, 210000],
        "weeks": 4
      },
      "3 Months": {
        "averages": [522000, 576000, 630000],
        "weeks": 12
      },
      "6 Months": {
        "averages": [1044000, 1152000, 1260000],
        "weeks": 24
      },
      "9 Months": {
        "averages": [1566000, 1728000, 1890000],
        "weeks": 36
      },
      "1 Year": {
        "averages": [2088000, 2304000, 2520000],
        "weeks": 48
      },
      "2 Years": {
        "averages": [4176000, 4608000, 5040000],
        "weeks": 96
      },
      "3 Years": {
        "averages": [6264000, 6912000, 7560000],
        "weeks": 144
      },
      "4 Years": {
        "averages": [8352000, 9216000, 10080000],
        "weeks": 192
      },
      "5 Years": {
        "averages": [10440000, 11520000, 12600000],
        "weeks": 240
      }
    },
    "stateHolderProposalTemplate": [
      "contract DFOHubGeneratedProposal {",
      "",
      "    string private _metadataLink;",
      "",
      "    constructor(string memory metadataLink) {",
      "        _metadataLink = metadataLink;",
      "    }",
      "",
      "    function getMetadataLink() public view returns(string memory) {",
      "        return _metadataLink;",
      "    }",
      "",
      "    function callOneTime(address proposal) public {",
      "        IStateHolder holder = IStateHolder(IMVDProxy(msg.sender).getStateHolderAddress());",
      "function_body",
      "    }",
      "}",
      "",
      "interface IMVDProxy {",
      "    function getStateHolderAddress() external view returns(address);",
      "}",
      "",
      "interface IStateHolder {",
      "    function clear(string calldata varName) external returns(bytes memory oldVal);",
      "    function setAddress(string calldata varName, address val) external returns (address);",
      "    function setBool(string calldata varName, bool val) external returns(bool);",
      "    function setBytes(string calldata varName, bytes calldata val) external returns(bytes memory);",
      "    function setString(string calldata varName, string calldata val) external returns(string memory);",
      "    function setUint256(string calldata varName, uint256 val) external returns(uint256);",
      "}"
    ],
    "simpleValueProposalTemplate": [
      "contract DFOHubGeneratedProposal {",
      "",
      "    string private _metadataLink;",
      "",
      "    constructor(string memory metadataLink) {",
      "        _metadataLink = metadataLink;",
      "    }",
      "",
      "    function getMetadataLink() public view returns(string memory) {",
      "        return _metadataLink;",
      "    }",
      "",
      "    function onStart(address newSurvey, address oldSurvey) public {",
      "    }",
      "",
      "    function onStop(address newSurvey) public {",
      "    }",
      "",
      "    function getValue() public view returns(type) {",
      "        return value;",
      "    }",
      "}"
    ],
    "oneTimeProposalTemplate": [
      "contract DFOHubGeneratedProposal {",
      "",
      "    string private _metadataLink;",
      "",
      "    constructor(string memory metadataLink) {",
      "        _metadataLink = metadataLink;",
      "    }",
      "",
      "    function getMetadataLink() public view returns(string memory) {",
      "        return _metadataLink;",
      "    }",
      "",
      "    function callOneTime(address proposal) public {",
      "function_body",
      "    }",
      "}"
    ]
  }