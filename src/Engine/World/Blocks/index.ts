import { BlockType } from '../../Types';
import BlockSchema from '../../Schema/BlockSchema';
// Block Imports
import GrassBlock from './GrassBlock';
// Block Map
export default (blockType: BlockType): BlockSchema | undefined => {
  switch (blockType) {
    case BlockType.Grass:
      return GrassBlock;
    default:
      return undefined;
  }
};
