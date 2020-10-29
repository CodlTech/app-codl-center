# Codl.center

[Codl.center](https://codl.center) is an interactive API reference for the
Avalanche-go node. It features the Avalabs official documentation, with the
option to send direct requests to your Avalanche node.

We know that developers & power users play an important role in growing a
thriving community. On that matter, the first challenge for a young blockchain
is to achieve a smooth learning curve.

[Codl.center](https://codl.center) serves the double purpose of getting the job
done while gradually memorizing the whole set of methods exposed by the
Avalanche node.

The web interface is generated from a set of [JSON-formatted API
specifications](https://github.com/codltech/app-codl-center/tree/master/src/data/specs).
It can easily be extended to support new blockchain VMs as soon as they get released.

**Early release**

Codl.center is released as part of the [MoneyDance
hackathon](https://www.moneydance.io/). This is an early release & some key
features are currently under development. Namely:

- Support for EVM API documentation.
- Connection to arbitrary node addresses. (right now it connect to the local
  node at `127.0.0.1:9650`)
- Connection to subnet blockchain. (right now API requests only use the default
  `/ext/bc/X` and `/ext/bc/P` endpoints)

**Notes**

* Codl.center is a pedagogic tool & is not meant to secure large sums of money.
* Codl.center is a client-side web application. It doesn't send data except when
  contacting your node (which should run locally).
* The source code is available [on
  Github](https://github.com/CodlTech/app-codl-center), and the web application
  is served directly from [this
  repository](https://github.com/CodlTech/app-codl-center-web).
* The build integrity can be verified by running `npm run check` from a source
  repository clone.
