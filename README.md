# Repro of async_hooks Issue

[Issue Here](https://github.com/nodejs/node/issues/22052)

```
git clone https://github.com/bradennapier/async_hooks_repro.git
cd async_hooks_repro
yarn
yarn build:prod
yarn try
```

I've set the `master` branch here to the problem when the `runInContext` function is an `async function` that never resolves.
