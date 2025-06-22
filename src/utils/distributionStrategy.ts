
import { SubjectData, BlockGenerationResult, GenerationParams } from './blockTypes';
import { generateUltraEfficientBlocks } from './ultraEfficientDistributor';
import { logger } from './logger';

export const executeBalancedDistribution = (
  subjectData: SubjectData[], 
  params: GenerationParams
): BlockGenerationResult => {
  logger.distribution.info('Executando distribuição balanceada com algoritmo ultra-eficiente');
  return generateUltraEfficientBlocks(subjectData, params);
};

export const executeDisproportionalDistribution = (
  subjectData: SubjectData[], 
  params: GenerationParams
): BlockGenerationResult => {
  logger.distribution.info('Executando distribuição desproporcional com algoritmo ultra-eficiente');
  return generateUltraEfficientBlocks(subjectData, params);
};
