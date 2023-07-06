window.BENCHMARK_DATA = {
  "lastUpdate": 1688678546942,
  "repoUrl": "https://github.com/MystenLabs/sui",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "93547199+oxade@users.noreply.github.com",
            "name": "oxade",
            "username": "oxade"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "250e9b481984e8d6a56db9c68e106ceb62b8cf23",
          "message": "port profiler to v0 (#12758)\n\n## Description \r\n\r\nPorts the profiler to exec v0 and cleansup some code.\r\nThis allows us to profile historical TXs\r\n\r\n## Test Plan \r\n\r\nManual\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T10:06:06-05:00",
          "tree_id": "d46b12ffaf02b1f4201288083ed92386c33d3f7e",
          "url": "https://github.com/MystenLabs/sui/commit/250e9b481984e8d6a56db9c68e106ceb62b8cf23"
        },
        "date": 1688051793120,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 355007,
            "range": "± 14999",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106119108+gegaowp@users.noreply.github.com",
            "name": "Ge Gao",
            "username": "gegaowp"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "100250e8039687f20eafa3fa745315d89af3c884",
          "message": "indexer fix: fromOrTO address filter fetch limit (#12763)\n\n## Description \r\n- quick fix for FromOrTo address, we need to fetch limit + 1 to check if\r\nwe have next page, I missed that\r\n- the FromOrTo query no longer needs GROUP BY tx_digest after de-duping\r\n(tx_digest, recipient) on the writing path, so I simplify the query a\r\nbit as well.\r\n\r\n## Test Plan \r\n\r\n```\r\ncurl --location --request POST http://127.0.0.1:3030 \\\r\n--header 'Content-Type: application/json' \\\r\n--data-raw '{\r\n    \"jsonrpc\": \"2.0\",\r\n    \"id\": 1,\r\n    \"method\": \"suix_queryTransactionBlocks\",\r\n    \"params\": [\r\n        {\r\n            \"filter\": {\r\n                \"FromOrToAddress\": {\"addr\": \"0xa7536c86055012cb7753fdb08ecb6c8bf1eb735ad75a2e1980309070123d5ef6\"}\r\n            }\r\n        },\r\n        null,\r\n        20,\r\n        false\r\n    ]\r\n}' | jq\r\n```\r\n\r\nrun this query and make sure the cursor and hasNextPage is set properly \r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T16:33:38Z",
          "tree_id": "0e95b704a1427946c6d3207ca80c70b33e8ecb92",
          "url": "https://github.com/MystenLabs/sui/commit/100250e8039687f20eafa3fa745315d89af3c884"
        },
        "date": 1688057340646,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 302744,
            "range": "± 26585",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "tmn@mystenlabs.com",
            "name": "Todd Nowacki",
            "username": "tnowacki"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c29e62377674fcd8f939411cc1975d35a8012929",
          "message": "[move] Remove dead code from MVCC support (#12765)\n\n## Description \r\n\r\n- The effective owner map was used in an early version of the previous\r\nPR (#12055) and was not properly removed\r\n\r\n## Test Plan \r\n\r\n- Ran existing tests\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T17:16:09Z",
          "tree_id": "20acab4e673f6f67fbc52c63006141fb616963c1",
          "url": "https://github.com/MystenLabs/sui/commit/c29e62377674fcd8f939411cc1975d35a8012929"
        },
        "date": 1688059510105,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 267233,
            "range": "± 17039",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ashok@mystenlabs.com",
            "name": "Ashok Menon",
            "username": "amnn"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ccde381c981723b32df8e5cb895fc04d7cfd2a5d",
          "message": "[sui-execution] README (#12767)\n\n## Description \r\n\r\nInternal documentation for working with `sui-execution`\r\n\r\n## Test Plan \r\n\r\n:eyes:",
          "timestamp": "2023-06-29T18:48:47Z",
          "tree_id": "cf54a5ef5a4819821a8f77d91c2da77609270125",
          "url": "https://github.com/MystenLabs/sui/commit/ccde381c981723b32df8e5cb895fc04d7cfd2a5d"
        },
        "date": 1688065121250,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 301327,
            "range": "± 20804",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lxfind@gmail.com",
            "name": "Xun Li",
            "username": "lxfind"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5d84ca30975618862ad7ff7e674daaec8d80b4",
          "message": "Add checkpoint printing to db-tool (#12768)\n\n## Description \r\n\r\nAdds two commands, PrintCheckpoint and PrintCheckpointContent. Both are\r\nby digest.\r\n\r\n## Test Plan \r\n\r\nTested on local db.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T18:49:50Z",
          "tree_id": "e0c35dc4a373300ed6afed57cf72eee27e78de58",
          "url": "https://github.com/MystenLabs/sui/commit/cc5d84ca30975618862ad7ff7e674daaec8d80b4"
        },
        "date": 1688065167915,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 291624,
            "range": "± 26618",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "8418040+longbowlu@users.noreply.github.com",
            "name": "Lu Zhang",
            "username": "longbowlu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5e9f52dcb4bd400cbf99bb307e853b62b958d8cb",
          "message": "remove lengthy logs in authority aggregator for past investigations (#12761)\n\n## Description \r\n\r\nas title\r\n\r\n## Test Plan \r\n\r\nHow did you test the new or updated feature?\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\nremove lengthy logs in authority aggregator for past investigations",
          "timestamp": "2023-06-29T21:25:46Z",
          "tree_id": "0ec24d5f88d0653f8e4f9283fe7f6c605e9227a9",
          "url": "https://github.com/MystenLabs/sui/commit/5e9f52dcb4bd400cbf99bb307e853b62b958d8cb"
        },
        "date": 1688074564407,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 262122,
            "range": "± 9757",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106645797+sadhansood@users.noreply.github.com",
            "name": "Sadhan Sood",
            "username": "sadhansood"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1f35bc00127749e551a4760ae69320314c1ae776",
          "message": "Improve db checkpoint handling (#12773)\n\n## Description \r\n\r\nThe current workflow of uploading db checkpoint only uploads in sequence\r\ni.e. it would wait forever if there could be gaps in epoch snapshot on\r\nthe remote storage. This is not a requirement and more often, we really\r\nwant to upload latest epochs and don't care if older epoch snapshots are\r\nthere or not.\r\nThis PR now makes it such that if there is a db checkpoint which is\r\npresent local but not on remote, it will upload it. Besides, it also\r\nimproves how garbage collection runs by making it not dependent on\r\nupload.\r\n\r\n## Test Plan \r\n\r\nAdded uni tests",
          "timestamp": "2023-06-29T14:32:58-07:00",
          "tree_id": "0347103d898e7b6ad6b87d3267e80a11dd874780",
          "url": "https://github.com/MystenLabs/sui/commit/1f35bc00127749e551a4760ae69320314c1ae776"
        },
        "date": 1688074827030,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 308702,
            "range": "± 7857",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rvantonder@gmail.com",
            "name": "Rijnard van Tonder",
            "username": "rvantonder"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a537c1ebf17a0e7802488c003083a318586de531",
          "message": "move: source service requires repo branch (#12667)\n\n## Description \r\n\r\nIntroduce a `branch` field in `config` when cloning repositories. If we\r\nrun the server on our code today, it won't verify source successfully\r\n(mismatch of `v1.5` framework packages `deepbook` and `sui-framework`\r\ndue to changes). We'll need this in general for other repositories.\r\n\r\n## Test Plan \r\n\r\nAdded test",
          "timestamp": "2023-06-29T15:41:18-07:00",
          "tree_id": "123fe0e14c8351b4c3de2a98899903902db1de42",
          "url": "https://github.com/MystenLabs/sui/commit/a537c1ebf17a0e7802488c003083a318586de531"
        },
        "date": 1688078930414,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 263553,
            "range": "± 27669",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ashok@mystenlabs.com",
            "name": "Ashok Menon",
            "username": "amnn"
          },
          "committer": {
            "email": "amenon94@gmail.com",
            "name": "Ashok Menon",
            "username": "amnn"
          },
          "distinct": true,
          "id": "a1bac02e861d61c720115822a15e70a112cf21fc",
          "message": "[sui-execution/v1] Hard code pack digest hash modules\n\nWe can't get rid of the alternate implementation of digest calculation\nuntil we drop support for protocol version 16 and below, but this is\none of the steps towards that.\n\nTest Plan:\n\nExisting tests",
          "timestamp": "2023-06-29T16:47:29-07:00",
          "tree_id": "a8d07261fd7754bca97a9afb95bf59484f466651",
          "url": "https://github.com/MystenLabs/sui/commit/a1bac02e861d61c720115822a15e70a112cf21fc"
        },
        "date": 1688083169257,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 395795,
            "range": "± 68901",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106119108+gegaowp@users.noreply.github.com",
            "name": "Ge Gao",
            "username": "gegaowp"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4e684ec359dcfc02a504765a3d35445591450773",
          "message": "indexer: de-dup fromOrToAddress digests (#12788)\n\n## Description \r\n\r\nDuplicate digests would happen when tx sender also has their own as\r\nrecipients.\r\n\r\n## Test Plan \r\n\r\ntesting on address\r\n`0x0000000000000000000000000000000000000000000000000000000000000000`\r\n\r\n```\r\ncurl --location --request POST http://127.0.0.1:3030 \\\r\n--header 'Content-Type: application/json' \\\r\n--data-raw '{\r\n    \"jsonrpc\": \"2.0\",\r\n    \"id\": 1,\r\n    \"method\": \"suix_queryTransactionBlocks\",\r\n    \"params\": [\r\n        {\r\n            \"filter\": {\r\n                \"FromOrToAddress\": {\"addr\": \"0x0000000000000000000000000000000000000000000000000000000000000000\"}\r\n            }\r\n        },\r\n        null,\r\n        5,\r\n        false\r\n    ]\r\n}' | jq\r\n  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\r\n                                 Dload  Upload   Total   Spent    Left  Speed\r\n100   984  100   667  100   317   1978    940 --:--:-- --:--:-- --:--:--  2972\r\n{\r\n  \"jsonrpc\": \"2.0\",\r\n  \"result\": {\r\n    \"data\": [\r\n      {\r\n        \"digest\": \"7CuBm1AnLgkBMB6GiEn5d3RizznF5LbawjJTs8A5dcXF\",\r\n        \"timestampMs\": \"1681318800000\",\r\n        \"checkpoint\": \"0\"\r\n      },\r\n      {\r\n        \"digest\": \"HneKYTSK8BKSxRftX3HEJrnLADzHVBQdHU7coCxaUw1T\",\r\n        \"timestampMs\": \"1681491604701\",\r\n        \"checkpoint\": \"85168\"\r\n      },\r\n      {\r\n        \"digest\": \"815xhvL4Xdan73ia922Ns58dhta7U1JaJbYvF8M1yJiJ\",\r\n        \"timestampMs\": \"1681578008541\",\r\n        \"checkpoint\": \"161191\"\r\n      },\r\n      {\r\n        \"digest\": \"3gKz11LNEX6B2bTubKqPeERADzA4BEw6DaQ4WrNoiv5e\",\r\n        \"timestampMs\": \"1681664411498\",\r\n        \"checkpoint\": \"237073\"\r\n      },\r\n      {\r\n        \"digest\": \"2Rom2LhVuUaiatCKUEKAJQwesM7PN95hLB5uYB7NW27y\",\r\n        \"timestampMs\": \"1681923621472\",\r\n        \"checkpoint\": \"467715\"\r\n      }\r\n    ],\r\n    \"nextCursor\": \"2Rom2LhVuUaiatCKUEKAJQwesM7PN95hLB5uYB7NW27y\",\r\n    \"hasNextPage\": true\r\n  },\r\n  \"id\": 1\r\n}\r\n```\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T21:39:02-04:00",
          "tree_id": "310868a11c9991eedfc37a2500b7da4009b9c643",
          "url": "https://github.com/MystenLabs/sui/commit/4e684ec359dcfc02a504765a3d35445591450773"
        },
        "date": 1688089726276,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 304931,
            "range": "± 6531",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "81660174+mwtian@users.noreply.github.com",
            "name": "mwtian",
            "username": "mwtian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bdd29d7f8e70d6632d7881dbe3e5c86cb455e507",
          "message": "Adjust a few logs (#12786)\n\n## Description \r\n\r\n- Avoid logging for every certificate broadcast in authority aggregator,\r\nto reduce noise.\r\n- Add more logging to help debug checkpoint and consensus issues.\r\n\r\n## Test Plan \r\n\r\nCI\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-29T21:30:14-07:00",
          "tree_id": "1e59134b6484bf53de76da5e21069b00bc2270f8",
          "url": "https://github.com/MystenLabs/sui/commit/bdd29d7f8e70d6632d7881dbe3e5c86cb455e507"
        },
        "date": 1688099835303,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 310717,
            "range": "± 25096",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zl9394@gmail.com",
            "name": "longbowlu",
            "username": "longbowlu"
          },
          "committer": {
            "email": "bwilliams.eng@gmail.com",
            "name": "Brandon Williams",
            "username": "bmwill"
          },
          "distinct": true,
          "id": "207be158228e113f47b766cb0a5db5cdf6a730aa",
          "message": "use live object iter",
          "timestamp": "2023-06-30T08:40:49-05:00",
          "tree_id": "ef233b56c764ca91238819b20aaabd941dfff7d4",
          "url": "https://github.com/MystenLabs/sui/commit/207be158228e113f47b766cb0a5db5cdf6a730aa"
        },
        "date": 1688133094713,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 306841,
            "range": "± 6936",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "93547199+oxade@users.noreply.github.com",
            "name": "oxade",
            "username": "oxade"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6d3e9b9b1bf19cd33ab608233e8a527372d7b6c9",
          "message": "[easy] improve comments (#12798)",
          "timestamp": "2023-06-30T15:19:57Z",
          "tree_id": "ab9e3b89e00cf3cc49a4454ae31a7e00c9e2fb30",
          "url": "https://github.com/MystenLabs/sui/commit/6d3e9b9b1bf19cd33ab608233e8a527372d7b6c9"
        },
        "date": 1688139001161,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 308382,
            "range": "± 20817",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106119108+gegaowp@users.noreply.github.com",
            "name": "Ge Gao",
            "username": "gegaowp"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "940bfb18fd37c849d3558b45a35d4a841fdb5d30",
          "message": "indexer easy: re-enable object history population (#12799)\n\n## Description \r\n\r\ntitle\r\n\r\n## Test Plan \r\n\r\nlocal run and make sure object history will be populated.\r\n\r\nTODO:\r\n- will set up testing DB on mainnet & testnet to see the storage\r\nconsumption\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-06-30T16:05:37Z",
          "tree_id": "41e961a13071d5800a36a968c3c692eb158ae900",
          "url": "https://github.com/MystenLabs/sui/commit/940bfb18fd37c849d3558b45a35d4a841fdb5d30"
        },
        "date": 1688141598167,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 306264,
            "range": "± 5311",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "mingwei@mystenlabs.com",
            "name": "Mingwei Tian",
            "username": "mwtian"
          },
          "committer": {
            "email": "81660174+mwtian@users.noreply.github.com",
            "name": "mwtian",
            "username": "mwtian"
          },
          "distinct": true,
          "id": "6911bf5eb83a8e47afe3da84e06b1b27c2ec0ec2",
          "message": "[ConsensusHandler] recover last consensus index",
          "timestamp": "2023-06-30T13:18:24-07:00",
          "tree_id": "a4c8d4c9464d239fc0ccaa0371ae2ab7a3173fb9",
          "url": "https://github.com/MystenLabs/sui/commit/6911bf5eb83a8e47afe3da84e06b1b27c2ec0ec2"
        },
        "date": 1688156816165,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 351933,
            "range": "± 59162",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "103447440+mystenmark@users.noreply.github.com",
            "name": "Mark Logan",
            "username": "mystenmark"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f1a7a4b2fd858e05a3f511d2ecb6964fc95a827f",
          "message": "Checkpoint fork detection (#12804)",
          "timestamp": "2023-06-30T23:20:18Z",
          "tree_id": "613c40dcb7524cac14972774606f10876e064e1c",
          "url": "https://github.com/MystenLabs/sui/commit/f1a7a4b2fd858e05a3f511d2ecb6964fc95a827f"
        },
        "date": 1688167727197,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 440573,
            "range": "± 77223",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "81660174+mwtian@users.noreply.github.com",
            "name": "mwtian",
            "username": "mwtian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a26be77372f9f8e7ff57a878ac8e8248211af74c",
          "message": "[ConsensusHandler] panic on deserialization failure (#12810)\n\n## Description \r\n\r\nA fork can happen in this case and the process should not continue.\r\n\r\n## Test Plan \r\n\r\nn/a\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-01T01:19:35Z",
          "tree_id": "0dc9888647a281904e34c97817f1d990c521267d",
          "url": "https://github.com/MystenLabs/sui/commit/a26be77372f9f8e7ff57a878ac8e8248211af74c"
        },
        "date": 1688174975936,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 297997,
            "range": "± 21551",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eugene@mystenlabs.com",
            "name": "Eugene Boguslavsky",
            "username": "ebmifa"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "02dc79891fd88de2731229dd557911f0f6e3073c",
          "message": "Sui v1.5.0 Branch Cut Framework snapshot (#12816)\n\n## Description \r\n\r\n`cargo run --bin sui-framework-snapshot`",
          "timestamp": "2023-07-02T14:40:50-05:00",
          "tree_id": "c44635a149978355804ba55ceed65fcb66649168",
          "url": "https://github.com/MystenLabs/sui/commit/02dc79891fd88de2731229dd557911f0f6e3073c"
        },
        "date": 1688327346141,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 386266,
            "range": "± 77086",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eugene@mystenlabs.com",
            "name": "Eugene Boguslavsky",
            "username": "ebmifa"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "20ec2730b47764cabc37870efa21e45262b0c7c9",
          "message": "Sui v1.6.0 version bump (#12817)\n\n## Description \r\n\r\nSui v1.6.0 version bump\r\n\r\n## Test Plan \r\n👀",
          "timestamp": "2023-07-02T20:54:00Z",
          "tree_id": "c9ea9d119bf333e6d88f3cdde8f1b62c38499725",
          "url": "https://github.com/MystenLabs/sui/commit/20ec2730b47764cabc37870efa21e45262b0c7c9"
        },
        "date": 1688331837828,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 345472,
            "range": "± 25816",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "adam@mystenlabs.com",
            "name": "Adam Welc",
            "username": "awelc"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4c63de131d75600f50ba8906012dc62f8f74d0ee",
          "message": "[move-compiler] A workaround to avoid spurious warning for module initializers (#12820)\n\n## Description \r\n\r\nThis is a temporary workaround (until we can do this properly on the Sui\r\nside) to avoid signaling that a module initializer is unused (and thus\r\nimplying that it is not called by the runtime).\r\n\r\n## Test Plan \r\n\r\nA test has been added\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [x] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\n\r\nNo longer signal that a module initializer function is unused.",
          "timestamp": "2023-07-03T02:59:02-07:00",
          "tree_id": "9193ff99b92f10e70e0b75a52bb5dc15d48e76db",
          "url": "https://github.com/MystenLabs/sui/commit/4c63de131d75600f50ba8906012dc62f8f74d0ee"
        },
        "date": 1688378972945,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 347778,
            "range": "± 16754",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "51927076+phoenix-o@users.noreply.github.com",
            "name": "phoenix",
            "username": "phoenix-o"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "379f285115942cc45bd4e3d043eaf83276701651",
          "message": "periodic compaction for effects (#12624)\n\nextends periodic compaction functionality to SST files of cfs affected\r\nby effects pruning",
          "timestamp": "2023-07-03T12:18:06+02:00",
          "tree_id": "7a6b885320b62d6a23e31fab6f888b9c6e4880a7",
          "url": "https://github.com/MystenLabs/sui/commit/379f285115942cc45bd4e3d043eaf83276701651"
        },
        "date": 1688379927679,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 351508,
            "range": "± 23296",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "8418040+longbowlu@users.noreply.github.com",
            "name": "Lu Zhang",
            "username": "longbowlu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "12552a99bad69d3bc9aa6f41d39ea972b1861bb5",
          "message": "Do not use alternate server name on Sui Node (#12807)\n\n## Description \r\n\r\nNow that we are a couple of protocol upgrades ahead of introducing\r\n`alternate_server_name`, it's safe to remove it.\r\n\r\n## Test Plan \r\n\r\nCI\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\nDo not use alternate server name on Sui Node",
          "timestamp": "2023-07-03T10:26:19-07:00",
          "tree_id": "5c7b5773654db01495744ae278ff3e2254823dd3",
          "url": "https://github.com/MystenLabs/sui/commit/12552a99bad69d3bc9aa6f41d39ea972b1861bb5"
        },
        "date": 1688405779915,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 516067,
            "range": "± 61601",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "8418040+longbowlu@users.noreply.github.com",
            "name": "Lu Zhang",
            "username": "longbowlu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "964a7070c45bfa626b0165069f709bb523856db3",
          "message": "log slow queries. Don't log success queries or user input errors. (#12809)\n\n## Description \r\n\r\n1. don't log success queries and user error queries\r\n2. log queries (success + failed) when it takes longer than the\r\nthreshold to finish.\r\n\r\n## Test Plan \r\n\r\nCI\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\nLog slow queries. Don't log success queries or user input errors.",
          "timestamp": "2023-07-03T10:26:42-07:00",
          "tree_id": "e748afb5fad332c144529ee3c2f2824964247b29",
          "url": "https://github.com/MystenLabs/sui/commit/964a7070c45bfa626b0165069f709bb523856db3"
        },
        "date": 1688405849254,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 312471,
            "range": "± 25397",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106645797+sadhansood@users.noreply.github.com",
            "name": "Sadhan Sood",
            "username": "sadhansood"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "db9427edb5b263069a03ca244ddd89f740b60787",
          "message": "Add library function to hard link a dir (#12781)\n\n## Description \r\n\r\nThis PR adds a library function to recursively hard link a directory.\r\nThis is going to be useful for scenarios where we want to restore a db\r\nfrom a state snapshot without compromising the consistency of the\r\noriginal db. If the restore fails on hard linked db, node can fall back\r\nto state sync based catchup.\r\n\r\n## Test Plan \r\n\r\nAdded a unit test",
          "timestamp": "2023-07-03T16:43:48-07:00",
          "tree_id": "3616673eac9b5904624438c312567ea16bec4330",
          "url": "https://github.com/MystenLabs/sui/commit/db9427edb5b263069a03ca244ddd89f740b60787"
        },
        "date": 1688428406507,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 304426,
            "range": "± 18935",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "108701016+joyqvq@users.noreply.github.com",
            "name": "Joy Wang",
            "username": "joyqvq"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "506a748f7cac12427f1ae79eec990ea950ad41bc",
          "message": "fix: add protocol version for upgraded multisig (#12812)\n\n## Description \r\n\r\n1.4.0 accepts both legacy and upgraded multisig. 1.3.0 only accepts\r\nlegacy multisig. this is to make upgraded multisig enabled only for\r\nprotocol version >= 18 when all validators upgrade.\r\n## Test Plan \r\n\r\nHow did you test the new or updated feature?\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-03T20:42:23-07:00",
          "tree_id": "141c4ea6a69f050333f5fea9cbfcfe131e40b978",
          "url": "https://github.com/MystenLabs/sui/commit/506a748f7cac12427f1ae79eec990ea950ad41bc"
        },
        "date": 1688442737933,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 258359,
            "range": "± 26463",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "alex@mystenlabs.com",
            "name": "Alex Tsiliris",
            "username": "Eis-D-Z"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9188d532f72cea63b3aeffcd42aca02259d2ef45",
          "message": "Increase reference gas price slightly to avoid failure after epoch change (#12602)\n\n## Description \r\n\r\nOn epoch change, a transaction that will be retried might fail due to\r\nhaving too low reference_gas_price set. This increases the gas_price\r\nslightly. Today there is no other consequence, in the future this might\r\nmean that the gas payed for the transaction will be slightly higher than\r\nlowest possible.\r\n\r\n## Test Plan \r\n\r\nExisting tests.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-04T12:29:03+03:00",
          "tree_id": "9fa0db47d8a4790de7bd8b649f9991e2cb76856d",
          "url": "https://github.com/MystenLabs/sui/commit/9188d532f72cea63b3aeffcd42aca02259d2ef45"
        },
        "date": 1688463464482,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 438400,
            "range": "± 62511",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "113150618+dariorussi@users.noreply.github.com",
            "name": "Dario Russi",
            "username": "dariorussi"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8917ce4215b0f79095c11695e199c2d2c5bd67dd",
          "message": "Rework gas logic (#12676)\n\n## Description \r\n\r\nThis is a refactor of the gas logic that better isolates version checks\r\nand gas operations.\r\nThe change looks bigger than it is because of deletion and protocol\r\nchanges.\r\n\r\nGas model v1 has been deleted entirely given it was a pre-mainnet\r\nsolution. That removed code for the gas model v1, a bunch of code in\r\n`TemporaryStore`, some tests, and a bit of cleanup in several spots.\r\n`crates/sui-cost-tables` has been removed and the 2 files needed have\r\nbeen moved in `crates/sui-types`; that does not make any change in\r\ndependencies so it's good.\r\n\r\nWe introduced a `GasCharger` which is the main instance that tracks\r\neverything about gas in transactions.\r\nGas objects are also \"embedded\" in there, so that is the only object\r\nthat is passed around during execution.\r\nWe can and should clean up a bit more around system vs users\r\ntransactions but this is already a decent step forward, and that clean\r\nup is non trivial, so better have that in a different PR.\r\n\r\nI still have to clean up tests and introduce a better model for gas\r\ntesting. They are brittle and not easy to manage still. In another PR\r\nthough.\r\n\r\nWe also introduce a new protocol version that protects towards a new\r\ncheck on the budget to verify that it is greater than the minimum charge\r\n(the lowest bucket of execution). That does not change the cost of any\r\nsuccessful transaction, it will simply not allow to pay under minimum\r\ncost, run out of gas anyway, but still run (with all implications). Now\r\ntransactions are verified at signing time that the budget is over the\r\nminimum.\r\n\r\n## Test Plan \r\n\r\nExisting tests, few adjusted for minimum budget that has changed.\r\nI will sync a full node from genesis both for mainnet and testnet to\r\nverify that no fork has been introduced.\r\nI will also run a node that performs conservation checks to make sure\r\nthings are good.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-04T12:16:23-05:00",
          "tree_id": "1352de69b39fad36442594ff51c534bb93105a99",
          "url": "https://github.com/MystenLabs/sui/commit/8917ce4215b0f79095c11695e199c2d2c5bd67dd"
        },
        "date": 1688491424098,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 261894,
            "range": "± 34216",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rvantonder@gmail.com",
            "name": "Rijnard van Tonder",
            "username": "rvantonder"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "60802f7b414aaa1ff5b8c0f8c5fe4fe8198ff87a",
          "message": "move: remove unwrap in source service (#12826)\n\n## Description \r\n\r\nJust a quick fix up to get better errors.\r\n\r\n## Test Plan \r\n\r\nManual, does not functionally changing feature behavior.",
          "timestamp": "2023-07-04T11:27:30-06:00",
          "tree_id": "68c3e1888ce2542ab77e5e046354cbf30234bb7d",
          "url": "https://github.com/MystenLabs/sui/commit/60802f7b414aaa1ff5b8c0f8c5fe4fe8198ff87a"
        },
        "date": 1688492098895,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 306907,
            "range": "± 22856",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rvantonder@gmail.com",
            "name": "Rijnard van Tonder",
            "username": "rvantonder"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d950c5c0a99274a28bf5965d11782a277f750d9f",
          "message": "move: minimal end-to-end source service (#12832)\n\n## Description \r\n\r\nAdds minimal end-to-end support to serve source code given an address and\r\nmodule, e.g.,:\r\n\r\n```\r\ncurl http://0.0.0.0:8000/api?address=0x2&module=address\r\n```\r\n\r\n## Test Plan \r\n\r\nExtends the integration test to resolve address/module pairs for an\r\nexample package.",
          "timestamp": "2023-07-04T12:46:52-06:00",
          "tree_id": "0abfa5ae5918a5e9e862a9e8550b9cfb124b0003",
          "url": "https://github.com/MystenLabs/sui/commit/d950c5c0a99274a28bf5965d11782a277f750d9f"
        },
        "date": 1688496984814,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 308242,
            "range": "± 10093",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "115710624+wiggins-dev@users.noreply.github.com",
            "name": "wiggins-dev",
            "username": "wiggins-dev"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a831c38fe094492ed115809ce18da52253d61566",
          "message": "[Deepbook] Support creating customized pool (#12819)\n\n## Description \r\n\r\nAdd entry function for creating pool with customized taker fee rete and\r\nmaker rebate rate.\r\nNo extra test needed since it is just a simple wrapper function.\r\n\r\n\r\n## Test Plan \r\n\r\nRun deepbook unit test.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [✅] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [✅] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-04T23:17:09-04:00",
          "tree_id": "c3f3de0d3ad94bf058c68bd118c9eac72cb08f47",
          "url": "https://github.com/MystenLabs/sui/commit/a831c38fe094492ed115809ce18da52253d61566"
        },
        "date": 1688527478453,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 312966,
            "range": "± 26208",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "123408603+healthydeve@users.noreply.github.com",
            "name": "Jian Lu",
            "username": "healthydeve"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4c68bb5239fb6d6d682b607b8d278388810d79da",
          "message": "[sui-test-validator] Implementing a persisted state that takes in network config (#12451)\n\n## Description \r\n\r\nThis PR adds the option to run `sui-test-validator` with a config\r\ndirectory passed in.\r\n\r\nThis is a rewrite of\r\nhttps://github.com/MystenLabs/sui/commit/f8477e811c1f6e1f26814ad16888748e10f0060f\r\nto use builder patterns in the network builders instead so that the code\r\nis cleaner and has less duplication.\r\n\r\nIn this current implementation I added an extra wallet account that\r\npopulates in the network config so a faucet can be spun up from that\r\nconfig.\r\n\r\n1. Generate a config to store db and genesis configs `sui genesis -f\r\n--with-faucet --working-dir=[some-directory]`\r\n2. `sui-test-validator --config-dir [some-directory]`\r\n\r\n## Test Plan \r\n\r\nHow did you test the new or updated feature?\r\nlocal run\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-05T12:03:00-04:00",
          "tree_id": "e25a229d1cac23e39862d66e9ebb920874a27c87",
          "url": "https://github.com/MystenLabs/sui/commit/4c68bb5239fb6d6d682b607b8d278388810d79da"
        },
        "date": 1688573403289,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 311219,
            "range": "± 22414",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "108701016+joyqvq@users.noreply.github.com",
            "name": "Joy Wang",
            "username": "joyqvq"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e29074700439cc073a41a0d3f7abc8266a90eb86",
          "message": "chore: reorder protocol version 17, 18 (#12839)\n\n## Description \r\n\r\nto match with https://github.com/MystenLabs/sui/pull/12837,\r\nexecution_version will go out with v18 (in 1.5.0) whereas the multisig\r\nfeature flag will be released with 1.4.2 in v17.\r\n\r\n## Test Plan \r\n\r\nHow did you test the new or updated feature?\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-05T17:23:03Z",
          "tree_id": "716bb7d1606ef2d7bc27c3e03ecdb1de6e525a12",
          "url": "https://github.com/MystenLabs/sui/commit/e29074700439cc073a41a0d3f7abc8266a90eb86"
        },
        "date": 1688578200045,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 301782,
            "range": "± 4295",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "damirka.ru@gmail.com",
            "name": "Damir Shamanaev",
            "username": "damirka"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8e86b48110fca607689210f46e0fb938d7d5be21",
          "message": "[framework] don't emit event on purchase with PurchaseCap (#12821)\n\n## Motivation\r\n\r\nPurchaseCap functionality is created specifically for extensions and\r\nlogic which may or may not be considered trading. And emitting an event\r\nwhen \"purchasing\" with the Cap breaks indexers and makes little sense -\r\nItemListed is not emitted, ItemDelisted as well.\r\n\r\nCurrently, all extensions rely on custom events for this purpose.\r\n\r\n## Description \r\n\r\nChanges the body of the `kiosk::purchase_with_cap` to NOT emit the\r\nItemPurchased event. Everything else is left intact.\r\n\r\n## Test Plan \r\n\r\nCurrent tests pass.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [x] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\n\r\n- The `kiosk::purchase_with_cap` method for [Sui\r\nKiosk](https://docs.sui.io/build/sui-kiosk) no longer emits the\r\n`ItemPurchased` event. This is a network optimization update that should\r\nhave minimal impact. If the logic of your application does rely on this\r\nevent, you must change it to leverage custom events instead.",
          "timestamp": "2023-07-05T20:50:04+03:00",
          "tree_id": "2bbe7609d627fd6953e5d08b56680fe4a3f41ab4",
          "url": "https://github.com/MystenLabs/sui/commit/8e86b48110fca607689210f46e0fb938d7d5be21"
        },
        "date": 1688580014422,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 272505,
            "range": "± 21919",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "eugene@mystenlabs.com",
            "name": "Eugene Boguslavsky",
            "username": "ebmifa"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "94803f6d3d162e6ed7c432b475282734d69c09cb",
          "message": "Downgrading to sui v1.5.0 (#12844)\n\n## Description \r\nDowngrading to sui v1.5.0 since we need to re-cut the branch\r\n\r\n## Test Plan \r\n👀",
          "timestamp": "2023-07-05T18:00:13Z",
          "tree_id": "9edb380c2e54ed1cdf3819bfbf69f8f0537df164",
          "url": "https://github.com/MystenLabs/sui/commit/94803f6d3d162e6ed7c432b475282734d69c09cb"
        },
        "date": 1688580448715,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 308731,
            "range": "± 17301",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "106645797+sadhansood@users.noreply.github.com",
            "name": "Sadhan Sood",
            "username": "sadhansood"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "04092e736b96065c88d0ab138abd0a9a1be0a6b6",
          "message": "Verify archive state using a one shot in memory store (#12730)\n\n## Description \r\n\r\nAdded a shared in memory store which only keeps last checkpoint and its\r\ncontent in memory. This helps iterate over checkpoints really fast as we\r\ndon't need to use a db and can run verification without writing to\r\nrocksdb ever.\r\n\r\n## Test Plan \r\n\r\nAdded unit tests",
          "timestamp": "2023-07-05T12:31:04-07:00",
          "tree_id": "6697a09536303bbd52718973b2157347dce3e988",
          "url": "https://github.com/MystenLabs/sui/commit/04092e736b96065c88d0ab138abd0a9a1be0a6b6"
        },
        "date": 1688586113897,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 352629,
            "range": "± 22051",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "rvantonder@gmail.com",
            "name": "Rijnard van Tonder",
            "username": "rvantonder"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c8290757bae4fabf94db98930a9027c4e335da1",
          "message": "move: source service eagerly hydrates modules in memory (#12840)\n\n## Description \r\n\r\nEagerly reads and hydrates source code on server start. Doing this\r\neagerly is reasonable right now since source is small (we might opt for\r\ngzip later too):\r\n\r\n```\r\n244K    sui-framework/packages/deepbook/sources\r\n 72K    sui-framework/packages/move-stdlib/sources\r\n348K    sui-framework/packages/sui-framework/sources\r\n240K    sui-framework/packages/sui-system/sources\r\n```\r\n\r\nThe type is set up with `Option` to allow hydrating source on first\r\nrequest too, but I didn't want to go that route because then we need to\r\nimplemented a writer lock and seems pretty overkill given scope right\r\nnow.\r\n\r\n\r\n---\r\n\r\nFor fun I looked at the local latency difference before/after this PR.\r\nThis isn't really meaningful on a local setup, but I've got the tooling\r\nset up with `vegeta` for testing eventual deployment so figured to look\r\nanyway.\r\n\r\n100 requests per second over 15 seconds (latencies generally lower with\r\nthis PR).\r\n\r\nBefore\r\n\r\n```\r\nRequests      [total, rate, throughput]  1500, 100.07, 100.06\r\nDuration      [total, attack, wait]      14.991483416s, 14.989767291s, 1.716125ms\r\nLatencies     [mean, 50, 95, 99, max]    1.544413ms, 1.475097ms, 2.169692ms, 3.43996ms, 8.906125ms\r\nBytes In      [total, mean]              5073000, 3382.00\r\n```\r\n\r\nAfter\r\n\r\n```\r\nRequests      [total, rate, throughput]  1500, 100.07, 100.06\r\nDuration      [total, attack, wait]      14.991182792s, 14.990031292s, 1.1515ms\r\nLatencies     [mean, 50, 95, 99, max]    1.316599ms, 1.270261ms, 1.769853ms, 2.501024ms, 5.567708ms\r\nBytes In      [total, mean]              5073000, 3382.00\r\n```\r\n\r\n## Test Plan \r\n\r\nUpdated test to use hydrated value.",
          "timestamp": "2023-07-05T13:59:13-06:00",
          "tree_id": "3cb87270b8d2376ac26eda50e8c530562470078b",
          "url": "https://github.com/MystenLabs/sui/commit/7c8290757bae4fabf94db98930a9027c4e335da1"
        },
        "date": 1688587773642,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 278708,
            "range": "± 20232",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "93547199+oxade@users.noreply.github.com",
            "name": "oxade",
            "username": "oxade"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2bc00efbfd010bc4919818844ceecdebaff1c0a7",
          "message": "[easy] fix name clobbering (#12790)",
          "timestamp": "2023-07-05T14:48:57-07:00",
          "tree_id": "253538d891cfd9af4a00153cceea9019a70c3d9e",
          "url": "https://github.com/MystenLabs/sui/commit/2bc00efbfd010bc4919818844ceecdebaff1c0a7"
        },
        "date": 1688594306054,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 259996,
            "range": "± 25429",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "103447440+mystenmark@users.noreply.github.com",
            "name": "Mark Logan",
            "username": "mystenmark"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d0c78f3a476de8499af9d7336bae9bb4c378b15e",
          "message": "Revert change to system transaction gas data (#12848)\n\nthis change (from #12676) broke compatibility since it was not gated -\r\nif the change was necessary we will have to put in a feature flag",
          "timestamp": "2023-07-05T15:36:53-07:00",
          "tree_id": "f63704d261117d00546fb6f270002cd724c6a565",
          "url": "https://github.com/MystenLabs/sui/commit/d0c78f3a476de8499af9d7336bae9bb4c378b15e"
        },
        "date": 1688597199174,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 303585,
            "range": "± 19102",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "mingwei@mystenlabs.com",
            "name": "MW Tian",
            "username": "mwtian"
          },
          "committer": {
            "email": "81660174+mwtian@users.noreply.github.com",
            "name": "mwtian",
            "username": "mwtian"
          },
          "distinct": true,
          "id": "3c131953f32959a7800b926bd6f7f6434587b750",
          "message": "[Narwhal] compute and log ConsensusOutput digest",
          "timestamp": "2023-07-05T16:19:24-07:00",
          "tree_id": "bc9e463333e6902829f9fc1b49f9a4c05ffd96c6",
          "url": "https://github.com/MystenLabs/sui/commit/3c131953f32959a7800b926bd6f7f6434587b750"
        },
        "date": 1688599889546,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 415218,
            "range": "± 35425",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "103447440+mystenmark@users.noreply.github.com",
            "name": "Mark Logan",
            "username": "mystenmark"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "199e0b0c43ade6f78377ed514012273749089657",
          "message": "Use delete_range instead of clear() to avoid race condition (#12855)\n\nbecause clear() drops and re-creates the table without holding a lock,\r\nit can cause crashes if other threads happen to try to write to or read\r\nfrom the table being cleared. I don't think it makes sense to add\r\nlocking to every DBMap access just to fix this case, so I'm just going\r\nto avoid calling clear().",
          "timestamp": "2023-07-05T19:58:22-07:00",
          "tree_id": "a77552a69559f45a57eb25f04b30981349c47697",
          "url": "https://github.com/MystenLabs/sui/commit/199e0b0c43ade6f78377ed514012273749089657"
        },
        "date": 1688612875444,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 327220,
            "range": "± 23943",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ashok@mystenlabs.com",
            "name": "Ashok Menon",
            "username": "amnn"
          },
          "committer": {
            "email": "amenon94@gmail.com",
            "name": "Ashok Menon",
            "username": "amnn"
          },
          "distinct": true,
          "id": "d97f6fa5ae5ee76584e93e58b49ed947dad84dc8",
          "message": "[protocol-upgrades] Add ability to add abilities\n\nRelax the restriction on adding new abilities to types introduced\nduring system package upgrades -- only the `key` ability remains\nrestricted.\n\nThis change is not guarded by a protocol config, because it is in the\ncodepath that decides whether an system package upgrade is compatible\nin the first place -- i.e. if a quorum of validators do not have this\nchange, the proposal to upgrade to a package where an existing type\nhas additional abilities will not succeed.  This codepath is also not\nrun on fullnodes (who assume that if a system package upgrade proposal\nwas executed successfully, validators confirmed that the upgrade was\ncompatible), so again, there is not a need for a feature gate in the\nprotocol config to coordinate the launch of this change -- it is\nself-coordinating.\n\nTest Plan:\n\nUpdated existing E2E tests and added a new one for the new restriction\non `key`:\n\n```\nsui-e2e-tests$ cargo simtest\n```",
          "timestamp": "2023-07-06T11:11:48+01:00",
          "tree_id": "ec6204f5ad4023d858c5671399546e4bed7751e9",
          "url": "https://github.com/MystenLabs/sui/commit/d97f6fa5ae5ee76584e93e58b49ed947dad84dc8"
        },
        "date": 1688638918319,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 335087,
            "range": "± 25079",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "akihidis@gmail.com",
            "name": "Anastasios Kichidis",
            "username": "akichidis"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a749fef58c93e02ab29cdb0e7465fc35ed61938d",
          "message": "[narwhal] use the LeaderSwapTable in the leader schedule (#12515)\n\n## Description \r\n\r\nFollow up of https://github.com/MystenLabs/sui/pull/12465\r\n\r\nThis PR is:\r\n* Introducing a new `protocol_config` feature flag\r\n`narwhal_new_leader_election_schedule` , so we keep all the new changes\r\ndisabled until we decide to enable on a new protocol version\r\n* Introducing the `LeaderSchedule` which from now on will be responsible\r\nfor crafting the leader schedule and used to perform the leader\r\nelection.\r\n* Is updating the leader schedule with the new scores every `K` commit\r\nrounds\r\n* Is injecting the `LeaderSchedule` to the primary node so it can be\r\nused from the `proposer` module as well since the schedule now can be\r\nupdated\r\n\r\nNext steps:\r\n\r\n- [x] calculate the swap table on every K committed subdags & wire into\r\nthe leader election algorithm\r\n- [x] ensure whole feature is gated behind a protocol config feature\r\nflag - and probably a config switch as we might need to have it disabled\r\nfor longer than a release cycle.\r\n- [ ] restore correct swap table after crash/recovery\r\n- [ ] modify the commit path so we repeat the leader election when we\r\ncommit recursively\r\n- [ ] modify the proposer to support the new leader election\r\ncapabilities\r\n- [ ] add testing\r\n\r\n## Test Plan \r\n\r\nAdded unit tests\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-06T15:51:03+01:00",
          "tree_id": "f79816dcc341cc743c2e16860376701ad9c1b543",
          "url": "https://github.com/MystenLabs/sui/commit/a749fef58c93e02ab29cdb0e7465fc35ed61938d"
        },
        "date": 1688655527565,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 309087,
            "range": "± 18639",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "2895723+tzakian@users.noreply.github.com",
            "name": "Tim Zakian",
            "username": "tzakian"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "331fa2da7e714fd787a1b0990e73549b9d48b349",
          "message": "[storage] Add per-epoch object marker table for shared object deletion and transfer-to-object (#12852)\n\n## Description \r\n\r\nThis adds a new table to the ``PerpetualTables` that holds the set of\r\nreceived and shared deleted objects during the epoch.\r\n\r\nThis table is not currently used anywhere and is unused. However, both\r\nshared-object deletion #12623 and transfer-to-object #12611 PRs rely on\r\nthis table.\r\n\r\nThis table can be pruned at epoch boundaries so the table key contains\r\nthe epoch ID.\r\n\r\n@laura-makdah and I have discussed and we're happy to either land this\r\nsoon, or to wait until one or the other above PRs is ready to land and\r\nland this change at the same time. Either way this change on its own\r\nshould be fine to land any time as the new table is not used anywhere\r\nyet.\r\n\r\n## Test Plan \r\n\r\nNot tested yet -- functionality will be tested in the two PRs being\r\nbuilt on top of this.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes",
          "timestamp": "2023-07-06T17:14:16Z",
          "tree_id": "3a4dd1c6c5bc17ced64bde4c9c89cb534c4c0fe0",
          "url": "https://github.com/MystenLabs/sui/commit/331fa2da7e714fd787a1b0990e73549b9d48b349"
        },
        "date": 1688664244451,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 308338,
            "range": "± 15140",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "8418040+longbowlu@users.noreply.github.com",
            "name": "Lu Zhang",
            "username": "longbowlu"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "68b28fb620ea4e99225fe4fcb622fe8fa00fde16",
          "message": "Reference Oracle Implementation (#12854)\n\n## Description \r\n\r\nThis PR implements the off chain part of an oracle Proof of Concept. \r\n\r\n## Test Plan \r\n\r\nTested in different networks.\r\n\r\n---\r\nIf your changes are not user-facing and not a breaking change, you can\r\nskip the following section. Otherwise, please indicate what changed, and\r\nthen add to the Release Notes section as highlighted during the release\r\nprocess.\r\n\r\n### Type of Change (Check all that apply)\r\n\r\n- [ ] protocol change\r\n- [ ] user-visible impact\r\n- [ ] breaking change for a client SDKs\r\n- [ ] breaking change for FNs (FN binary must upgrade)\r\n- [ ] breaking change for validators or node operators (must upgrade\r\nbinaries)\r\n- [ ] breaking change for on-chain data layout\r\n- [ ] necessitate either a data wipe or data migration\r\n\r\n### Release notes\r\nThis PR implements the off chain part of an oracle Proof of Concept.\r\n\r\n---------\r\n\r\nCo-authored-by: jk jensen <azjkjensen@gmail.com>",
          "timestamp": "2023-07-06T18:09:53Z",
          "tree_id": "28d7e1c6004806c49c4cf67825324954df05bc78",
          "url": "https://github.com/MystenLabs/sui/commit/68b28fb620ea4e99225fe4fcb622fe8fa00fde16"
        },
        "date": 1688667425129,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 307979,
            "range": "± 29409",
            "unit": "ns/iter"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "103447440+mystenmark@users.noreply.github.com",
            "name": "Mark Logan",
            "username": "mystenmark"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "33e1e140371f774cf0f02b9c27371cb8a779a039",
          "message": "Do not use VerifiedTransaction type on clients (#12757)\n\nThis PR paves the way for moving to stateful authenticators, which are\r\ngenerally difficult or impossible to use correctly on clients until we\r\nhave better light client infrastructure.\r\n\r\nVerifiedTransaction is intended to prevent unverified transactions from\r\nentering the validator core accidentally, so their use on clients was\r\nunnecessary to begin with.\r\n\r\nNote that TransactionOrchestrator continues to use VerifiedTransaction -\r\nthis is for two reasons:\r\n- it has an AuthorityState handle so it is easy for it to do so even\r\nwith a stateful authenticator\r\n- it should catch bad signatures early rather than relying on validators\r\nto do that",
          "timestamp": "2023-07-06T14:14:57-07:00",
          "tree_id": "27c508a89070427ff3da5dbf40e43b9789cd1d22",
          "url": "https://github.com/MystenLabs/sui/commit/33e1e140371f774cf0f02b9c27371cb8a779a039"
        },
        "date": 1688678545182,
        "tool": "cargo",
        "benches": [
          {
            "name": "get_checkpoint",
            "value": 303745,
            "range": "± 17141",
            "unit": "ns/iter"
          }
        ]
      }
    ]
  }
}