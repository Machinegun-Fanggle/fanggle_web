import path from 'path';
import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config: any) => {
    console.log("path " + path.resolve(__dirname, '../src/app/components'));
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, '../src'),
      '@component': path.resolve(__dirname, '../src/app/components'),
      '@public': path.resolve(__dirname, '../src/public'),
      '@svg': path.resolve(__dirname, '../src/app/components/svg'),
      '@lib': path.resolve(__dirname, '../src/app/lib'),
      '@util': path.resolve(__dirname, '../src/app/util'),
    };
    return config;
  },
};

export default config;
