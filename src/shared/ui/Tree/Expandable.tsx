import React from 'react'
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

interface RenderTree {
  id: number | string;
  nodeId?: number | string;
  name: string;
  children?: Array<RenderTree>
}

const data: RenderTree = {
  id: 'root',
  name: 'ПБС',
  children: [
    // {
    //   id: 1,
    //   name: 'Child - 1',
    // },
    {
      id: 3,
      name: '101',
      children: [
        {
          id: 4,
          name: '10101',
          children: [
            {
              id: 5,
              name: '10101001'
            }
          ]
        },
      ],
    },
  ],
};

const Expandable = () => {
  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id as string} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 400, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {renderTree(data)}
    </TreeView>
  );
}

export default Expandable