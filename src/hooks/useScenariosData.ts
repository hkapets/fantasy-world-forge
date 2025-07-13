import { useLocalStorage } from './useLocalStorage';

export interface Scenario {
  id: string;
  worldId: string;
  title: string;
  description: string;
  type: 'adventure' | 'campaign' | 'oneshot' | 'sidequest';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  status: 'draft' | 'active' | 'completed' | 'paused';
  tags: string[];
  estimatedDuration: string;
  playerCount: string;
  createdAt: string;
  lastModified: string;
}

export function useScenariosData() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('fantasyWorldBuilder_scenarios', []);

  const addScenario = (scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'lastModified'>) => {
    const newScenario: Scenario = {
      ...scenarioData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setScenarios(prev => [...prev, newScenario]);
    return newScenario;
  };

  const updateScenario = (scenarioId: string, updates: Partial<Omit<Scenario, 'id' | 'createdAt'>>) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === scenarioId 
          ? { ...scenario, ...updates, lastModified: new Date().toISOString() }
          : scenario
      )
    );
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== scenarioId));
  };

  const getScenariosByWorld = (worldId: string) => {
    return scenarios.filter(scenario => scenario.worldId === worldId);
  };

  const getScenarioById = (scenarioId: string) => {
    return scenarios.find(scenario => scenario.id === scenarioId);
  };

  return {
    scenarios,
    addScenario,
    updateScenario,
    deleteScenario,
    getScenariosByWorld,
    getScenarioById
  };
}