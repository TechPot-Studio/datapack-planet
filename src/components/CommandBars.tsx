import {
  CommandBar,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import React, { FormEvent, useState } from 'react';
import SettingsPanel from './SettingsPanel';
import { injectIntl } from 'react-intl';

export default injectIntl(function CommandsBar(props: any) {
  const { intl } = props;
  const [newDialogHidden, setNewDialogHidden] = useState(true);
  const [settingsShow, setSettingsShow] = useState(false);
  const [error, setError] = useState('');
  const [selectingTag, setSelectingTag] = useState(false);
  const [id, setId] = useState('');
  const [tagType, setTagType] = useState('');
  const [type, setType] = useState('');
  const [prefix, setPrefix]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState(undefined);

  function typeSelectorChangeHandler(
    _e: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ) {
    if (item.key === 'tags') {
      setSelectingTag(true);
      setPrefix('#');
    } else {
      setSelectingTag(false);
      setPrefix(undefined);
    }
    setType(item.key as string);
  }

  function createHandler() {
    setNewDialogHidden(true);
    // TODO 2021/2/6 should have a public create file fn
  }

  return (
    <>
      <CommandBar
        items={[
          {
            key: 'new',
            text: intl.formatMessage({ id: 'actions.new' }),
            iconProps: { iconName: 'Add' },
            onClick: () => {
              setNewDialogHidden(false);
              setSelectingTag(false);
              setPrefix(undefined);
            },
          },
          {
            key: 'save',
            text: intl.formatMessage({ id: 'actions.save' }),
            iconProps: { iconName: 'Save' },
          },
          {
            key: 'open',
            text: intl.formatMessage({ id: 'actions.open' }),
            iconProps: { iconName: 'FolderOpen' },
          },
        ]}
        overflowItems={[
          {
            key: 'metadata',
            text: intl.formatMessage({ id: 'actions.editMeta' }),
            iconProps: { iconName: 'Edit' },
          },
        ]}
        farItems={[
          {
            key: 'setting',
            text: 'Settings',
            iconProps: { iconName: 'Settings' },
            iconOnly: true,
            onClick: () => {
              setSettingsShow(true);
            },
          },
        ]}
      />
      <Dialog
        hidden={newDialogHidden}
        dialogContentProps={{
          type: DialogType.normal,
          title: intl.formatMessage({
            id: 'dialog.createFile.title',
          }),
          subText: intl.formatMessage({
            id: 'dialog.createFile.desc',
          }),
          closeButtonAriaLabel: 'Close',
          onDismiss: () => setNewDialogHidden(true),
        }}
      >
        <Dropdown
          placeholder="Select the type of the new file"
          label="New file type:"
          options={[
            {
              key: 'advancements',
              text: intl.formatMessage({
                id: 'type.advancement',
              }),
            },
            {
              key: 'dimension_type',
              text: intl.formatMessage({ id: 'type.dimType' }),
            },
            {
              key: 'dimension',
              text: intl.formatMessage({ id: 'type.dim' }),
            },
            {
              key: 'functions',
              text: intl.formatMessage({ id: 'type.fn' }),
              selected: true,
            },
            {
              key: 'item_modifiers',
              text: intl.formatMessage({
                id: 'type.itemModifier',
              }),
              disabled: true,
            },
            {
              key: 'loot_tables',
              text: intl.formatMessage({ id: 'type.lootTable' }),
            },
            {
              key: 'predicates',
              text: intl.formatMessage({ id: 'type.predicate' }),
            },
            {
              key: 'recipes',
              text: intl.formatMessage({ id: 'type.recipe' }),
            },
            {
              key: 'tags',
              text: intl.formatMessage({ id: 'type.tag' }),
            },
          ]}
          onChange={typeSelectorChangeHandler}
        />
        <Label style={{ display: selectingTag ? undefined : 'none' }}>
          With the tag type:
        </Label>
        <Dropdown
          placeholder={intl.formatMessage({ id: 'dialog.tagType' })}
          options={[
            { key: 'blocks', text: 'Blocks tag' },
            { key: 'entity_types', text: 'Entity types tag' },
            { key: 'functions', text: 'Functions tag' },
            { key: 'fluids', text: 'Fluids tag' },
            { key: 'items', text: 'Items tag' },
          ]}
          hidden={!selectingTag}
          onChange={(_e: FormEvent<HTMLDivElement>, item: IDropdownOption) =>
            setTagType(item.key as string)
          }
        />
        <TextField
          placeholder={intl.formatMessage({ id: 'general.nsId' })}
          label={`${intl.formatMessage({ id: 'general.nsId' })}:`}
          errorMessage={error}
          onChange={(
            _e: React.FormEvent<HTMLInputElement>,
            newText: string
          ) => {
            if (
              newText.match(/^([a-z-0-9_]+:)?[a-z-0-9_]+(\/[a-z-0-9_]+)*$/g)
            ) {
              if (!newText.match(/[^a-z-0-9_]/g)) {
                setError('Do not omit "minecraft" namespace');
              } else {
                setError('');
              }
            } else {
              setError('Namespaced identifier is invalid');
            }
            setId(newText);
          }}
          prefix={prefix}
        />
        <DialogFooter>
          <PrimaryButton
            onClick={createHandler}
            text={intl.formatMessage({ id: 'button.create' })}
          />
          <DefaultButton
            onClick={() => setNewDialogHidden(true)}
            text={intl.formatMessage({ id: 'button.cancel' })}
          />
        </DialogFooter>
      </Dialog>
      <SettingsPanel show={settingsShow} setStateFn={setSettingsShow} />
    </>
  );
});
