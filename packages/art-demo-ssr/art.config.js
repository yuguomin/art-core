const projectVirtualPath = 'demo/ssr/react';

const artConfig = {

  projectVirtualPath,

  projectType: 'SSR',

  // The version 
  version: Date.now(),

  // If true will received `public/some/module/bundle229503e9d2e481b9223c.js`
  // If false will received `public/some/module/bundle.js`
  enableBundleHashName: false,

  devHost: {
    dev: "http://me.dev.com",
    prod: "http://me.dev.com"
  },

  webpack: {
    entry: {
      [`${projectVirtualPath}/home`]: ["./client/home/index.tsx"],
      [`${projectVirtualPath}/product`]: ["./client/product/index.tsx"]
    },
    output: {
      // Config CDN path for static files, images ....
      intePublicPath: 'http://10.10.10.132:9090/frontend/',
      prodPublicPath: 'replace_it'
    },
    dll: {
      version: 'dll_version_01',
      vendors: [] // modify this option cautiously
    }
  }
}

module.exports = artConfig;