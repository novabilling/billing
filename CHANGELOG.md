# Changelog

## [2.0.0](https://github.com/pimabill/billing/compare/v1.0.0...v2.0.0) (2026-10-24)


### ⚠ BREAKING CHANGES

* **deploy:** the stack no longer starts without real secrets in .env.
* **payments:** Stripe needs webhookSecret and Flutterwave secretHash configured, or their payments are not confirmed.
* **auth:** portal links with ?key= stop working; keys with resource scopes are limited to those resources.

### Features

* add PayPal provider, fix multi-provider dashboard, regroup analytics KPIs ([f120fe8](https://github.com/pimabill/billing/commit/f120fe8b63da40b084548c9f44b1c99518c4a39e))
* apply PR review comments, analytics KPIs backend endpoint, ARR display, tooltips, provider ordering, multi-provider checkout ([2fcdff1](https://github.com/pimabill/billing/commit/2fcdff10ae4b618c92e889619789350e0d27464d))
* **dashboard:** branded sign-in pages, brand fonts, kept out of search ([b2afe54](https://github.com/pimabill/billing/commit/b2afe54e9e9e846431634f7af32177ead1e68306))
* **dashboard:** the animated mark is the loading indicator everywhere ([58ba521](https://github.com/pimabill/billing/commit/58ba521e90480a511b657b712e4ef39161029838))
* friendlier SDKs, kept in step with the API and docs ([46694f1](https://github.com/pimabill/billing/commit/46694f17643e84efe9a48cc54a5e5f29c43e9ef3))
* **landing:** rebuild the landing page on the PimaBill brand ([833b8eb](https://github.com/pimabill/billing/commit/833b8ebf09ff7f22ce42007c81017ef3e909eb24))
* money movement, ledger, crypto, team access and migrations ([425c284](https://github.com/pimabill/billing/commit/425c284c7e90827dac6de26839b2195c7e495017))
* **money:** managed payments collect mobile money and PayPal too ([e4cbc87](https://github.com/pimabill/billing/commit/e4cbc87b9dc6f4c4833c82fb5a07a0a60864540b))
* **money:** managed payments collect mobile money and PayPal too ([b56270a](https://github.com/pimabill/billing/commit/b56270a7b1e4069da285bfa7ea066d733b14b79f))
* **money:** managed payments pay out to mobile money, bank or PayPal ([202e936](https://github.com/pimabill/billing/commit/202e9369ccdddc7d336c266bc9daae9a26dcf1ff))
* **money:** managed payments pay out to mobile money, bank or PayPal ([83e81c0](https://github.com/pimabill/billing/commit/83e81c0862a0c1a86a6069db225e289ba2d71293))
* organisation access controls, a platform service API and an operator command ([165eb23](https://github.com/pimabill/billing/commit/165eb23201ddd23ae30ae36906e94d02eaf4bf68))
* organisation access controls, a platform service API and an operator command ([d012579](https://github.com/pimabill/billing/commit/d012579c6bbafc626f78f1ac8c9875f8d7ec2d19))
* plan limits an operator can set per organisation ([73cc5c4](https://github.com/pimabill/billing/commit/73cc5c4d7cff1ce330e22c57dfe875f18dd72b19))
* plan limits an operator can set per organisation ([0a98d35](https://github.com/pimabill/billing/commit/0a98d35bfedfebd5d7f6f1cbbe25f10aa0a7eecc))
* **platform:** control-plane service API exposes the console's organisation data ([dcde48b](https://github.com/pimabill/billing/commit/dcde48b11bc4f07830847df50015c2c2f961b2c4))
* **platform:** control-plane service API exposes the console's organisation data ([e55475e](https://github.com/pimabill/billing/commit/e55475eff2aac31a0ee55d1e5ba105bc1321fac8))
* **platform:** the platform console moves to the private control panel ([e5ae4e9](https://github.com/pimabill/billing/commit/e5ae4e9f0e6e8d26a31545e0010df9cc9bb06652))
* **platform:** the platform console moves to the private control panel ([5b804fd](https://github.com/pimabill/billing/commit/5b804fda2b7e1da29ab12673b97101e0101b32f2))
* price PimaBill Cloud at $15/month ([656b836](https://github.com/pimabill/billing/commit/656b8367537b290786180950ed63b034b1194c98))
* price PimaBill Cloud at $15/month and capitalise the wordmark ([92106a1](https://github.com/pimabill/billing/commit/92106a11f6c0c9ddae5ca91b65ca642eae97a967))
* rebuild the landing page, sign-in pages and docs on the PimaBill brand ([b80d758](https://github.com/pimabill/billing/commit/b80d7580111c8a9d1a5f27e97e1b2cbb349ccaff))
* **sdk:** PimaBillClient everywhere and the hosted API by default ([ebdbba8](https://github.com/pimabill/billing/commit/ebdbba8c1b1379d7317a2fc59e9d072a6523d82d))


### Bug Fixes

* add noopener,noreferrer to checkout window.open to prevent tabnabbing ([bea3798](https://github.com/pimabill/billing/commit/bea3798779b007bca3a9d7de8145ffeade166b80))
* add proper auth error handling in PesapalProvider.getAccessToken ([12d91c6](https://github.com/pimabill/billing/commit/12d91c6fc48da8a64b7b40bb28d08e87f3ac0f0a))
* address CI findings on the system review changes ([1c7f7d9](https://github.com/pimabill/billing/commit/1c7f7d90458fb00ac9c642f6c4c8f3698c7751b5))
* **api:** describe the responses of the money, ledger and team endpoints ([132382e](https://github.com/pimabill/billing/commit/132382e4f60aa3f80b454d24e607897f4832ca3e))
* **api:** optional, typed query parameters and a real amount type ([77cc2ec](https://github.com/pimabill/billing/commit/77cc2ec275e1d797cbdddc3a8fac6bf83f26e350))
* **api:** typed parties, whole-number counts and one request type per endpoint ([28e08df](https://github.com/pimabill/billing/commit/28e08df0f01ba88848591fcde988dc2df7bdaedf))
* **auth:** enforce API key scopes, hash keys, scope portal links ([f55aad9](https://github.com/pimabill/billing/commit/f55aad942fdd9b2f5005011b4c7cd7ad7e25259b))
* Auto-register Pesapal IPN URL on provider creation (Option A) ([c2c2134](https://github.com/pimabill/billing/commit/c2c213467a09819347ee2f953aba3c976847e488))
* **billing:** bill each period exactly once, and fix dunning ([55a7287](https://github.com/pimabill/billing/commit/55a7287d8c9f4121aa2669195a51c2b0f5e07440))
* currency-aware amount formatting and environment label in Pesapal charge errors ([010acbc](https://github.com/pimabill/billing/commit/010acbc40437498d5ba1b890f6c3474ab2b76282))
* **deploy:** refuse placeholder secrets; document the security changes ([762cfac](https://github.com/pimabill/billing/commit/762cfacb3d904647068ca6d94d0bbee52c446247))
* **deploy:** ship the compose file and pull images from this repo's owner ([c743e03](https://github.com/pimabill/billing/commit/c743e03f0c85b12cdfb5dd307c674e58c6eb3865))
* **deploy:** ship the compose file and pull images from this repo's owner ([b2cb7b4](https://github.com/pimabill/billing/commit/b2cb7b4acd18da650dc09595aa22c205fd29ca8e))
* Docker compose on server ([e6525cc](https://github.com/pimabill/billing/commit/e6525cc3f604f4ba0ef0b1466804c4d4bab46f7a))
* Docker compose on server ([c7017ef](https://github.com/pimabill/billing/commit/c7017effb737795c2796235de1017a6a62245ea6))
* handle webhook pending status, fix priority nullish coalescing, tabnabbing security ([ab02851](https://github.com/pimabill/billing/commit/ab02851b00b008024276c52283613be34e76065d))
* keep platform access fields out of the sign-in response ([b53dd96](https://github.com/pimabill/billing/commit/b53dd96c01700940e9a2d276931f3037680a9d9b))
* migrate tenant databases as the database admin ([7083383](https://github.com/pimabill/billing/commit/7083383289af28497694e69d40ae2464c2c63c4a))
* migrate tenant databases as the database admin ([364e2f9](https://github.com/pimabill/billing/commit/364e2f9926b67f91f5aa72ab543789b6e1946ba1))
* one broken tenant database no longer keeps the API down ([5adc6d0](https://github.com/pimabill/billing/commit/5adc6d00160421c1e08abc9009720baa2db2a2ae))
* one broken tenant database no longer keeps the API down ([23a5ef6](https://github.com/pimabill/billing/commit/23a5ef67fd8dd2cf50d775d456d61b2647ddf42a))
* **payments:** verify every payment notification before settling ([43ef528](https://github.com/pimabill/billing/commit/43ef5287b65bff3a4164995788babb05d882e7bf))
* **paypal:** remove redundant application_context causing every checkout to 422 ([243f5e9](https://github.com/pimabill/billing/commit/243f5e932f9ba487cfbe19ffb497387a82ab852a))
* **paypal:** remove redundant application_context causing every checkout to 422 ([df58681](https://github.com/pimabill/billing/commit/df586815e5ce24c7d675e013f87eb221fd700c12))
* Pesapal checkout 'Invalid IPN URL ID' by supporting ipnId credential ([de4aae3](https://github.com/pimabill/billing/commit/de4aae3fccd9893761b36840eaf4cc21d14ad346))
* regenerate backend/package-lock.json to resolve CI npm ci failure ([82f040a](https://github.com/pimabill/billing/commit/82f040a68dd791fddb1833eabbd9a5f94eaeeb79))
* resolve Pesapal transaction amount limit error ([1199674](https://github.com/pimabill/billing/commit/11996743a510533d011895a10811b972356c3d13))
* **sdk:** one bearer token, positional ids, binary invoice PDF ([09ba8aa](https://github.com/pimabill/billing/commit/09ba8aa9a44955621ed2aff0a7c44c37e2b99528))
* **security:** block SSRF, encrypt with AES-GCM, run each cron once ([948df5f](https://github.com/pimabill/billing/commit/948df5f9aaac78d98ac0e40e0939d8a3af8e2a26))
* ship the brand fonts with the apps instead of fetching them at build time ([59d50d4](https://github.com/pimabill/billing/commit/59d50d4a7c2afe6dda67f170746e7a6f0f67cc73))
* ship the brand fonts with the apps instead of fetching them at build time ([2815d94](https://github.com/pimabill/billing/commit/2815d94e53159ca373471827bc795dd9f042c58a))
* **webhooks:** keep looking when a shared provider account is not this tenant's ([d89d847](https://github.com/pimabill/billing/commit/d89d8477d918fead2b6443e83f2ae38f488af993))
* **webhooks:** keep looking when a shared provider account is not this tenant's ([579d01d](https://github.com/pimabill/billing/commit/579d01d402ffda06288c0e1158e11fff5bb57812))
* write the brand as PimaBill in the wordmark, not lowercase ([f54fce9](https://github.com/pimabill/billing/commit/f54fce9798576939480c2b38fa1bafde717c58c2))
