import { Map as ImmutableMap } from 'immutable';
import { Nfspvc } from './models';

export const yamlTemplates = ImmutableMap().setIn(
  [Nfspvc, 'default'],
  `
apiVersion: ${Nfspvc.apiGroup}/${Nfspvc.apiVersion}
kind: ${Nfspvc.kind}
metadata:
  name: example
  namespace: default
spec:
  accessmodes: 
  - ReadWriteMany
  capacity:
    sotrage: 1Gi
  path: /my_volume/volume_path
  server: vs-nas-omer
`,
);
