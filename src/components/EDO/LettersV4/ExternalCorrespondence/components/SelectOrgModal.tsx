import { useState, useEffect } from "react";
import { Modal } from "@ui";
import {
  Tabs,
  Tab,
  Button,
  Chip,
  Stack,
  TextField,
  Box,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  useFetchOrganisationTreeMutation,
  useLazyFetchOrganisationListQuery,
} from "@services/generalApi";

// 🔁 Рекурсивный поиск узла по id
const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (String(node.id) === String(id)) return node;
    if (node.child?.length) {
      const found = findNodeById(node.child, id);
      if (found) return found;
    }
  }
  return null;
};

// 🔧 Иммутабельное обновление child узла
const updateNodeChildren = (nodes, targetId, children) => {
  return nodes.map((node) => {
    if (String(node.id) === String(targetId)) {
      return {
        ...node,
        child: children,
      };
    }
    if (node.child?.length) {
      return {
        ...node,
        child: updateNodeChildren(node.child, targetId, children),
      };
    }
    return node;
  });
};

function SelectOrgModal({ open, onClose, handleSave }) {
  const [tabValue, setTabValue] = useState(1);
  const [searchValue, setSearchValue] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedTreeIds, setSelectedTreeIds] = useState(null);

  const [treeData, setTreeData] = useState([]);
  const [expanded, setExpanded] = useState([]);

  const [fetchOrgTree] = useFetchOrganisationTreeMutation();
  const [fetchOrgList, { data: organisationsList }] =
    useLazyFetchOrganisationListQuery();

  // 🔄 Обработка expand
  const handleToggle = async (event, nodeIds) => {
    setExpanded(nodeIds);

    const lastExpandedId = nodeIds?.find((el) => el);
    const node = findNodeById(treeData, lastExpandedId);

    // Загружаем только если ещё не загружены
    if (node && (!node.child || node.child.length === 0)) {
      const res: any = await fetchOrgTree({ parrentId: node.id });
      const newChildren = res?.data?.items || [];

      // Обновляем дерево без мутаций
      const newTree = updateNodeChildren(treeData, node.id, newChildren);
      setTreeData(newTree);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTreeItemsChange = (e, newSelectedItems) => {
    setSelectedTreeIds(newSelectedItems);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    if (value?.length) {
      fetchOrgList({ text: value }).then((res) => {
        setTableData(res?.data?.items || []);
      });
    } else {
      setTableData([]);
    }
  };

  const handleSelectSingleRow = (state, id) => {
    if (state) {
      setSelectedTreeIds(id);
    }

    if (!state) {
      setSelectedTreeIds(null);
    }
  };
  const renderTreeItems = (nodes) =>
    nodes?.map((node) => (
      <TreeItem key={node.id} itemId={String(node.id)} label={node.value}>
        {/* Показываем заглушку если есть потенциальные дети, но ещё не загружены */}
        {node.hasChildren && (!node.child || node.child.length === 0) ? (
          <TreeItem
            key={`${node.id}-placeholder`}
            itemId={`${node.id}-placeholder`}
            label="Загрузка..."
            disabled
          />
        ) : (
          renderTreeItems(node.child)
        )}
      </TreeItem>
    ));

  const selectedTreeObjects = [selectedTreeIds]
    .map((id) => findNodeById(treeData, id))
    .filter(Boolean);

  console.log(selectedTreeObjects, "selectedTreeObjects");

  // 🔃 Загрузка корневых узлов при открытии или поиске
  useEffect(() => {
    fetchOrgTree({ text: searchValue }).then((res: any) => {
      const rootItems = res?.data?.items || [];

      // Проставляем hasChildren вручную если API не даёт
      const itemsWithFlag = rootItems.map((item) => ({
        ...item,
        hasChildren: true, // или из API
      }));

      setTreeData(itemsWithFlag);
    });
  }, [searchValue]);

  return (
    <Modal open={open} setOpen={onClose}>
      <div className="tw-w-full tw-h-full">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Выбор министерств и ведомств" />
          <Tab
            disabled={!selectedTreeIds}
            value={2}
            label="Выбранные министерства и ведомства"
          />
        </Tabs>

        <div className="tw-w-full tw-my-5 tw-h-[90%] tw-flex tw-flex-col tw-justify-between tw-items-start">
          {tabValue === 1 ? (
            <>
              <TextField
                fullWidth
                label="Введите имя организации"
                size="small"
                onChange={({ target }) => handleSearch(target.value)}
              />

              <div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-x-4 tw-my-4">
                <TextField
                  select
                  fullWidth
                  label="Исполнительные органы государственной власти"
                  size="small"
                >
                  <MenuItem value={1}>1</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Города и районы"
                  size="small"
                  select
                >
                  <MenuItem value={1}>1</MenuItem>
                </TextField>
              </div>

              {tableData?.length ? (
                <div className="tw-my-4">
                  <TableContainer sx={{ maxHeight: 150, overflowY: "auto" }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>№</TableCell>
                          <TableCell>Имя организации</TableCell>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((el, i) => (
                          <TableRow key={el.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{el.value}</TableCell>
                            <TableCell>
                              <Checkbox
                                checked={selectedTreeIds === el.id}
                                onChange={({ target }) => {
                                  handleSelectSingleRow(target.checked, el.id);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : null}

              <div className="tw-my-4">
                <Box sx={{ height: 350, minWidth: 250, overflowY: "auto" }}>
                  <SimpleTreeView
                    // multiSelect
                    checkboxSelection
                    onSelectedItemsChange={handleTreeItemsChange}
                    selectedItems={selectedTreeIds}
                    expandedItems={expanded}
                    onExpandedItemsChange={handleToggle}
                  >
                    {renderTreeItems(treeData)}
                  </SimpleTreeView>
                </Box>
              </div>
            </>
          ) : (
            <div>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={2}>
                {selectedTreeObjects.map((item) => (
                  <Chip
                    key={`tree-${item.id}`}
                    label={item.value}
                    onDelete={() => setSelectedTreeIds(null)}
                  />
                ))}
              </Stack>
            </div>
          )}

          <div className="tw-w-full tw-grid tw-grid-cols-2 tw-gap-x-4 tw-my-4">
            <Button variant="contained" onClick={onClose}>
              Отмена
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                handleSave({
                  id: selectedTreeObjects?.[0]?.id,
                  value: selectedTreeObjects?.[0]?.value,
                })
              }
            >
              Выбрать
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SelectOrgModal;
