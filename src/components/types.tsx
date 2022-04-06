export interface Activity {
  key: number,
  identifier: string,
  optimisticValue: number,
  mostProbableValue: number,
  pessimisticValue: number,
  criticalPath: boolean,
  estimatedDuration?: number,
  standardError?: number,
  variance?: number,
  firstGauss?: number[],
  secondGauss?: number[],
  thirdGauss?: number[],
}

export interface Project {
  estimatedDuration?: number,
  standardError?: number,
  variance?: number,
  firstGauss?: number[],
  secondGauss?: number[],
  thirdGauss?: number[],
}