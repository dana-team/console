import { K8sKind } from '@console/internal/module/k8s';

export const Nfspvc: K8sKind = {
  label: 'Nfspvc',
  apiGroup: 'nfspvc.dana.io', 
  apiVersion: 'v1alpha1',
  plural: 'nfspvcs',
  abbr: 'NPC',
  namespaced: true,
  kind: 'NfsPvc',
  id: 'nfspvc',
  labelPlural: 'Nfs Pvc', 
  crd: true,
};

