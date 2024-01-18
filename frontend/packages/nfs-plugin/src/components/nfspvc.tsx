import * as React from 'react';
import * as _ from 'lodash-es';
import { sortable } from '@patternfly/react-table';
import * as classNames from 'classnames';
import {  ListPage, Table, TableData, RowFunctionArgs } from '@console/internal/components/factory';
import {
  ResourceLink,
  // ResourceSummary,
  // SectionHeading,
  Timestamp,
  resourcePathFromModel,
} from '@console/internal/components/utils';
import { K8sResourceKind } from  '@console/internal/module/k8s';
import { Nfspvc } from '../models';
import { referenceForModel } from '@console/internal/module/k8s';

const tableColumnClasses = [
  classNames('col-l-5', 'col-l-6'),
  classNames('col-l-5', 'col-l-6'),
  classNames('col-l-5', 'col-l-6'),
  classNames('col-l-5', 'col-l-6'),
];

const NfsPvcHeader = () => {
  return [
    {
      title: 'Name',
      sortField: 'metadata.name',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      title: 'Namespace',
      sortField: 'metadata.namespace',
      transforms: [sortable],
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'Size',
      sortField: 'spec.capacity',
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'Server',
      sortField: 'spec.server',
      transforms: [sortable],
      props: { className: tableColumnClasses[3] },
    },
    {
      title: 'Created',
      sortField: 'metadata.creationTimestamp',
      transforms: [sortable],
      props: { className: tableColumnClasses[4] },
    }, 
  ];
};
NfsPvcHeader.displayName = 'NfsPvcHeader';



const NfsPvcTableRow: React.FC<RowFunctionArgs<K8sResourceKind>> = ({ obj }) =>{
  return (
    <>
      <TableData className={classNames(tableColumnClasses[0], 'co-break-word')}>
        <ResourceLink kind={referenceForModel(Nfspvc)} name={obj.metadata.name} namespace={obj.metadata.namespace}></ResourceLink>
      </TableData>
      <TableData className={classNames(tableColumnClasses[1], 'co-break-word')}>
        <ResourceLink kind="Namespace" name={obj.metadata.namespace}></ResourceLink>
      </TableData>
      <TableData className={classNames(tableColumnClasses[2], 'co-break-word')}>
      {obj.spec?.capacity?.storage}
      </TableData>
      <TableData className={classNames(tableColumnClasses[3], 'co-break-word')}>
      {obj.spec?.server}
      </TableData>
      <TableData className={classNames(tableColumnClasses[4], 'co-break-word')}>
        <Timestamp timestamp={obj.metadata.creationTimestamp}></Timestamp>
      </TableData>
    </>
  );
};



 
    
export const NfsPvcList: React.SFC = React.memo((props) => {
  
  return (
  <Table
    {...props}
    aria-label={Nfspvc.labelPlural}
    Header={NfsPvcHeader}
    Row={NfsPvcTableRow}
    virtualize
  />
  )
});
NfsPvcList.displayName = 'Nfspvclist';

export const NfsPvcPage: React.FC<SubnamespacePageProps> = (props) => {
  
  const createProps = {
    to: `${resourcePathFromModel(
      Nfspvc,
      null,
      _.get(props, 'namespace', 'default'),
    )}/~new/form`,
  };

  return (
    <ListPage
      {..._.omit(props, 'mock')}
      title="Nfs Pvc's"
      kind={referenceForModel(Nfspvc)}
      ListComponent={NfsPvcList}
      canCreate={true}
      createProps={createProps}
      createButtonText="Create Nfs Pvc"
      customData={""}
    />
  );
};

export type SubnamespaceDetailsProps = {
  obj: K8sResourceKind;
};

export type SubnamespacePageProps = {
  namespace?: string;
  name:string
};

export type SubnamespaceDetailsPageProps = {
  match: any;
};

export type GridDashboardCard = {
  Card: React.ComponentType<any>;
};
