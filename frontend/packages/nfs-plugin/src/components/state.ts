import { K8sResourceKind } from '@console/internal/module/k8s';

type State = {
  name: string,
  server: String,
  capacityValue: Number,
  capacityUnit: String,
  path: String,
  AccessMode: String,
  progress: false,
  error: '',
  payload: K8sResourceKind;
};

export const defaultState = {
  name: '',
  server: '',
  capacityValue: '0',
  capacityUnit: 'Gi',
  path: '',
  AccessMode: 'ReadWriteMany',
  progress: false,
  error: '',
  payload: {},
};

type Action =
  | { type: 'setPath'; path: string }
  | { type: 'setName'; name: string }
  | { type: 'setServer'; server: string }
  | { type: 'setCapacityValue'; capacity: string }
  | { type: 'setCapacityUnit'; capacityUnits: string }
  | { type: 'setProgress' }
  | { type: 'unsetProgress' }
  | { type: 'setError'; message: string }
  | { type: 'setPayload'; payload: {} }
  | { type: 'setAccessModeValue'; AccessModeValue: string }
  | { type: 'setAccessMode'; AccessMode: string }

export const commonReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setPath':
      return Object.assign({}, state, { path: action.path});
    case 'setName':
      return Object.assign({}, state, { name: action.name });
    case 'setServer':
      return Object.assign({}, state, { server: action.server });
    case 'setAccessMode':
      return Object.assign({}, state, { AccessMode: action.AccessMode });
    case 'setAccessModeValue':
      return Object.assign({}, state, { setAccessModeValue: action.AccessModeValue });
    case 'setProgress':
      return Object.assign({}, state, { progress: true });
    case 'unsetProgress':
      return Object.assign({}, state, { progress: false });
    case 'setError':
      return Object.assign({}, state, { error: action.message });
    case 'setCapacityUnit':
      return Object.assign({}, state, { capacityUnit: action.capacityUnits});
    case 'setCapacityValue':
      return Object.assign({}, state, { capacityValue: action.capacity});
    case 'setPayload':
      return Object.assign({}, state, { payload: action.payload });
    default:
      return defaultState;
  }
};
