
import { StudyBlock } from '@/types/cycle';

export class BlockValidationService {
  validateBlockDurations(blocks: StudyBlock[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    blocks.forEach((block, index) => {
      if (block.duration % 15 !== 0) {
        errors.push(`Bloco ${index + 1} tem duração inválida: ${block.duration}min`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  validateCompletedBlocks(completedBlocks: string[], validBlocks: StudyBlock[]): string[] {
    const validIds = validBlocks.map(block => block.persistentId).filter(id => id && id !== 'undefined');
    
    return completedBlocks.filter(id => validIds.includes(id) && id !== 'undefined');
  }

  fixInvalidBlocks(blocks: StudyBlock[]): StudyBlock[] {
    const subjectCounters: { [key: string]: number } = {};
    
    return blocks.map((block, index) => {
      if (!subjectCounters[block.subject]) {
        subjectCounters[block.subject] = 0;
      }
      subjectCounters[block.subject]++;
      
      return {
        ...block,
        id: block.id || crypto.randomUUID(),
        persistentId: `${block.subject}-bloco-${subjectCounters[block.subject]}`,
        blockNumber: index + 1
      };
    });
  }
}

export const blockValidationService = new BlockValidationService();
