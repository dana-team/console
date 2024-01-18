import * as _ from 'lodash';
import * as models from './models';
import {
  Plugin,
  ModelDefinition,
  ModelFeatureFlag,
  ResourceListPage,
  ResourceDetailsPage,
  RoutePage,
  HorizontalNavTab,
} from '@console/plugin-sdk';
// TODO(vojtech): internal code needed by plugins should be moved to console-shared package
// import { PodModel } from '@console/internal/models';
import { referenceForModel } from '@console/internal/module/k8s';

//import { yamlTemplates } from './yaml-templates';

type ConsumedExtensions =
  | ModelDefinition
  | ModelFeatureFlag
  | ResourceListPage
  | ResourceDetailsPage
  // | YAMLTemplate
  | RoutePage
  | HorizontalNavTab;

// const TEST_MODEL_FLAG = 'TEST_MODEL';

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: [models.Nfspvc],
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.Nfspvc,
      flag: 'NFSPVC',
    },
  },
  {
    type: 'ModelDefinition',
    properties: {
      models: [models.Nfspvc],
    },
  },
  {
    type: 'Page/Resource/List',
    properties: {
      model: models.Nfspvc,
      loader: () =>
        import('./components/nfspvc' /* webpackChunkName: "demo" */).then(
          (m) => m.NfsPvcPage,
        ),
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${referenceForModel(models.Nfspvc)}/~new/form`,
      loader: () =>
        import(
          './components/create-nfs' /* webpackChunkName: "create-obc" */
        ).then((m) => m.CreateNfspvc),
    },
  },
];

export default plugin;
