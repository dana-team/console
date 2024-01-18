import * as React from 'react';
import { Helmet } from 'react-helmet';
import { match } from 'react-router';
import { Dropdown } from '@console/internal/components/utils/dropdown';
import * as classNames from 'classnames';
import {
  ButtonBar,
  history
} from '@console/internal/components/utils';
import { k8sCreate, K8sResourceKind, referenceFor } from '@console/internal/module/k8s';
import { resourceObjPath } from '@console/internal/components/utils';
import { commonReducer, defaultState } from './state';
import { Nfspvc } from '../models';
import { ActionGroup, Button } from '@patternfly/react-core';
import { BlueInfoCircleIcon } from '@console/shared';
import "./nfspvc.css"


export const dropdownAccessModes = {
    ReadWriteMany: 'ReadWriteMany',
    ReadWriteOnce: 'ReadWriteOnce',
    ReadOnlyMany: 'ReadOnlyMany',
};
export const dropdownUnitsStorage = {
  Mi: 'MiB',
  Gi: 'GiB',
};
const Section = ({ label, children }) => (
  <div>
    <div className="co-form-section__label">{label}</div>
    <div className="co-form-subsection">{children}</div>
  </div>
);




export const CreateNfspvc: React.FC<CreateNfsPVC> = (props) => {
  const [state, dispatch] = React.useReducer(commonReducer, defaultState);
  const namespace = props?.match?.params?.ns;

  React.useEffect(() => {
    let  obj: K8sResourceKind = {}
       obj = {
        apiVersion: `${Nfspvc.apiGroup}/${Nfspvc.apiVersion}`,
        kind: `${Nfspvc.kind}`,
        metadata: {
          name: state.name,
          namespace,
        },
        spec: {     
              path: state.path,
              capacity: {storage: `${state.capacityValue}${state.capacityUnit}`},
              server: state.server,
              accessModes: [state.AccessMode],
        },
     };
    dispatch({ type: 'setPayload', payload: obj})
    }, [namespace, state.name, state.path, state.capacityValue, state.capacityUnit, state.server, state.AccessMode]);

    const save = (e: React.FormEvent<EventTarget>) => {
      e.preventDefault();
      dispatch({ type: "setProgress"})
      console.log(Nfspvc)
      k8sCreate(Nfspvc, state.payload)
        .then( (resource) => {
            dispatch({ type: "unsetProgress"})
            history.push(resourceObjPath(resource, referenceFor(resource)));
        })
        .catch((err) => {
          dispatch({ type: "setError", message: err.message})
          dispatch({ type: "unsetProgress"})
        }
      );
    };
    
  return (
    <div className="co-m-pane__body co-m-pane__form">
      <Helmet>
        <title>Create NFS PVC</title>
      </Helmet>
      <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
        <div className="co-m-pane__name">Create NFS PVC</div>
      </h1>
      <form className="co-m-pane__body-group" onSubmit={save}>

      <Section label="PVC Name">
          <div className="form-group">
              <input
              className="pf-c-form-control"
              type="text"
              onChange = {(e) => dispatch({type: 'setName', name: e.currentTarget.value})}
              placeholder="my-storage"
              aria-describedby="pvcnfs-name-help"
              id="pvcnfs-name"
              name="pvcnfsname"
              required
              />
              <p className="help-block" id="pvc-name-help">
              Choose a name for your NFS PVC storage
              </p>
          </div>
        </Section>


        <div className="co-form-section__separator" />

        {(
        <Section label="NFS Details">
          <div className="form-group">
            <label className="control-label co-required" htmlFor="request-path-input">
                Path
            </label>
            <div className="form-group">
              <div className="pf-c-input-group">
                <input
                  className={classNames('pf-c-form-control')}
                  type="text"
                  placeholder="/volume/my_volume"
                  onChange={(e) => dispatch({type: 'setPath', path: e.currentTarget.value})}
                  name="path"
                  aria-describedby="path-help"
                  id="path"
                  required
                />
            </div>
            <p className="help-block" id="path-help">
                The Path has to begin with '/'
              </p>
            </div>
        
            <label className="control-label co-required" htmlFor="request-capacity-input">
              Capacity
            </label>
            <div className="form-group">
              <div className="pf-c-input-group">
                <input
                  className={classNames('pf-c-form-control')}
                  type="number"
                  name="requestCapacity"
                  placeholder="size"
                  required
                  onChange={(e) => dispatch({type: 'setCapacityValue', capacity: e.currentTarget.value})}
                  id="capacityValue"
                />
                <Dropdown
                  className="btn-group"
                  title={dropdownUnitsStorage['Gi']}
                  name="capacityUnit"
                  items={dropdownUnitsStorage}
                  onChange={(unit) => dispatch({type: 'setCapacityUnit', capacityUnits: unit})}
                  required
                />
              </div>
            </div>

            <label className="control-label co-required" htmlFor="request-accessmode-input">
              AccessMode
            </label>
            <div className="form-group">
              <div className="pf-c-input-group">
                <Dropdown
                  className="btn-group"
                  title={dropdownAccessModes["ReadWriteMany"]}
                  name="AccessMode"
                  items={dropdownAccessModes}
                  onChange={(unit) => dispatch({type: 'setAccessMode', AccessMode: unit})}
                  required
                />
              </div>
            </div>

            <label className="control-label co-required" htmlFor="request-server-input">
                Server
            </label>
            <div className="form-group">
              <div className="pf-c-input-group">
                <input
                  className={classNames('pf-c-form-control')}
                  type="text"
                  placeholder="vs-nas-omer"
                  onChange={(e) => dispatch({type: 'setServer', server: e.currentTarget.value})}
                  name="server"
                  aria-describedby="server-help"
                  id="server"
                  required
                />
            </div>
            </div>
            <div  className="help-block">
            <BlueInfoCircleIcon/>
            <p>
                For the PVC to work you have to ask the provider (the team that supplied you with the volume) to export it to the cluster segment!
              </p>
            </div>


            
          </div>
        </Section>
        )}
        
        <ButtonBar errorMessage={state.error} inProgress={state.progress}>
          <ActionGroup className="pf-c-form">
            <Button type="submit" variant="primary">
              Create
            </Button>
            <Button onClick={history.goBack} type="button" variant="secondary">
              Cancel
            </Button>
          </ActionGroup>
        </ButtonBar>
      </form>
    </div>
  );
};

type CreateNfsPVC = {
  match: match<{ ns?: string }>;
};
