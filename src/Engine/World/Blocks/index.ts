import { BlockType } from '../../Types';
import type BlockSchema from '../../Schema/BlockSchema';
// Block Imports
import GrassBlock from './GrassBlock';
import WaterBlock from './WaterBlock';
// Block Map
export default (blockType: BlockType): BlockSchema | undefined => {
  switch (blockType) {
    case BlockType.Grass:
      return GrassBlock;
    case BlockType.Water:
      return WaterBlock;
    default:
      return undefined;
  }
};
