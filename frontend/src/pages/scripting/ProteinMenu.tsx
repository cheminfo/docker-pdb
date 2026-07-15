import {
  Button,
  ButtonGroup,
  InputGroup,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Tooltip,
} from '@blueprintjs/core';
import { useState } from 'react';

/** PDB identifiers are 4 characters (a digit followed by 3 alphanumerics). */
const PDB_ID_PATTERN = /^[0-9][A-Za-z0-9]{3}$/;

export interface ProteinMenuProps {
  /** Every protein with stored scripts, sorted. */
  proteinIds: string[];
  /** The protein currently open in the editor. */
  currentPdbId: string;
  /** Load a protein and all of its scripts. */
  onSelect: (pdbId: string) => void;
  /** Register a new protein, seeded with the generic global-view script. */
  onAdd: (pdbId: string) => Promise<void>;
  /** Ask to delete every script stored for a protein. */
  onRemove: (pdbId: string) => void;
}

/**
 * Toolbar menu listing every protein that has stored scripts. Selecting one
 * loads it and reloads all of its scripts; the input at the bottom appends a
 * new one.
 * @param props - See {@link ProteinMenuProps}.
 * @returns The protein menu React element.
 */
export default function ProteinMenu(props: ProteinMenuProps) {
  const { proteinIds, currentPdbId, onSelect, onAdd, onRemove } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [newPdbId, setNewPdbId] = useState('');

  const trimmed = newPdbId.trim().toUpperCase();
  const isValid = PDB_ID_PATTERN.test(trimmed);
  const isDuplicate = proteinIds.includes(trimmed);

  async function handleAdd() {
    if (!isValid || isDuplicate) return;
    await onAdd(trimmed);
    setNewPdbId('');
    setIsOpen(false);
    onSelect(trimmed);
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      content={
        <Menu className="scripting-protein-menu">
          <MenuDivider title="Proteins with saved scripts" />
          {proteinIds.length === 0 ? (
            <MenuItem disabled text="No protein stored yet" />
          ) : (
            proteinIds.map((id) => (
              <MenuItem
                key={id}
                icon={id === currentPdbId ? 'tick' : 'blank'}
                text={id}
                selected={id === currentPdbId}
                onClick={() => {
                  onSelect(id);
                  setIsOpen(false);
                }}
                labelElement={
                  <Tooltip
                    content={`Delete all scripts for ${id}`}
                    placement="right"
                  >
                    <Button
                      variant="minimal"
                      size="small"
                      icon="trash"
                      intent={Intent.DANGER}
                      onClick={(event) => {
                        // Without this the MenuItem's own onClick would fire
                        // and load the protein we are trying to delete.
                        event.stopPropagation();
                        setIsOpen(false);
                        onRemove(id);
                      }}
                    />
                  </Tooltip>
                }
              />
            ))
          )}
          <MenuDivider />
          <div className="scripting-protein-add">
            <InputGroup
              value={newPdbId}
              onValueChange={setNewPdbId}
              placeholder="Add a PDB code…"
              size="small"
              maxLength={4}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              intent={
                trimmed.length > 0 && (!isValid || isDuplicate)
                  ? Intent.DANGER
                  : Intent.NONE
              }
              rightElement={
                <ButtonGroup>
                  <Button
                    size="small"
                    icon="add"
                    intent={Intent.SUCCESS}
                    disabled={!isValid || isDuplicate}
                    onClick={() => void handleAdd()}
                  />
                </ButtonGroup>
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleAdd();
                if (event.key === 'Escape') setIsOpen(false);
              }}
            />
            <p className="scripting-protein-hint">
              {isDuplicate
                ? `${trimmed} already has scripts — pick it from the list.`
                : 'A new code starts from a generic global-view script.'}
            </p>
          </div>
        </Menu>
      }
    >
      <Tooltip content="Proteins with saved scripts" placement="bottom">
        <Button
          icon="cube"
          endIcon="caret-down"
          onClick={() => setIsOpen((open) => !open)}
        >
          {currentPdbId}
        </Button>
      </Tooltip>
    </Popover>
  );
}
